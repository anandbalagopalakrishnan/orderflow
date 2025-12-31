import os
from dotenv import load_dotenv

# Load .env file FIRST, before any other imports that might need env vars
env = os.environ.get('FLASK_ENV', 'development')
env_file = f'.env.{env}'
if os.path.exists(env_file):
    load_dotenv(env_file)
else:
    load_dotenv()  # Fall back to .env

from flask import Flask
from flask_socketio import SocketIO
from app.routes import main

import logging

def auto_init_database():
    """Auto-initialize database if tables are missing."""
    from ticker.fyers_sm import SymbolMaster
    import os
    
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    
    sm = SymbolMaster()
    tables = sm.list_available_tables()
    
    # If no symbol tables exist, download and initialize them
    if not tables:
        logging.info("Database empty - initializing symbol data...")
        urls = [
            "https://public.fyers.in/sym_details/NSE_CM.csv",
            "https://public.fyers.in/sym_details/NSE_FO.csv",
            "https://public.fyers.in/sym_details/NSE_CD.csv",
        ]
        try:
            sm.process_all(urls)
            logging.info("Database initialization complete.")
        except Exception as e:
            logging.warning(f"Failed to initialize symbol data: {e}. App will continue without symbol data.")
    else:
        logging.info(f"Database ready with tables: {tables}")

class AccessLogFilter(logging.Filter):
    def filter(self, record):
        return "/fyers/callback" not in record.getMessage()

# Filter out sensitive auth callback logs from werkzeug
logging.getLogger('werkzeug').addFilter(AccessLogFilter())

app = Flask(__name__)

# Secrets and config from environment (set via .env / container)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-me')

# Register routes
app.register_blueprint(main)

# Initialize Socket.IO
async_mode = os.environ.get('SOCKETIO_ASYNC_MODE', 'threading')  # 'eventlet' recommended in production
cors_origins_env = os.environ.get('CORS_ORIGINS', '*')
# If '*' allow all; otherwise split comma-separated list
cors_allowed = '*' if cors_origins_env.strip() == '*' else [o.strip() for o in cors_origins_env.split(',') if o.strip()]
socketio = SocketIO(app, cors_allowed_origins=cors_allowed, async_mode=async_mode)

# Debug: log effective CORS for sockets
try:
	print(f"SocketIO async_mode={async_mode}, cors_allowed_origins={cors_allowed}")
except Exception:
	pass

# Import socket events after socketio is created
from app.socket_events import register_socket_events
register_socket_events(socketio)

if __name__ == '__main__':
	# Initialize database on startup
	auto_init_database()
	
	# Dev server; production uses Gunicorn with eventlet
	debug = os.environ.get('FLASK_ENV', 'development') != 'production'
	host = os.environ.get('APP_HOST', '0.0.0.0')
	port = int(os.environ.get('APP_PORT', 5000))
	socketio.run(app, debug=debug, host=host, port=port)
