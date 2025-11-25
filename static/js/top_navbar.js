
// Navbar and style utilities for ------>kodebuds Chartink's 

import { showSettingsPopup, injectSettingsStyles } from './settings.js';

// Store navbar visibility state
let isNavbarVisible = true;

// Setup navbar toggle keyboard shortcuts
function setupNavbarToggle() {
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.code === 'Space') {
            e.preventDefault();
            toggleNavbarVisibility();
        } else if (e.ctrlKey && e.key.toLowerCase() === 'x') {
            e.preventDefault();
            toggleLowVolumeMarker();
        }
    });
}

export function createNavbar() {
    const navbar = document.createElement('nav');
    navbar.id = 'main-navbar';

    // Apply inline styles for critical rendering path
    const navStyles = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '35px',
        background: '#131722',
        color: '#D1D4DC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: '1000',
        boxShadow: '0 1px 0 #23263A',
        userSelect: 'none',
        padding: '0',
        fontSize: '12px'
    };

    Object.assign(navbar.style, navStyles);

    // Create HTML structure for the navbar
    navbar.innerHTML = `
        <div id="navbar-left" class="navbar-section">
            <div id="symbol-info" class="symbol-container">
                <span class="search-icon">&#128269;</span>
                <span id="current-symbol" class="current-symbol"></span>
            </div>
            <div id="timeframe-selector" class="timeframe-container"></div>
        </div>
        <div id="navbar-right" class="navbar-section">
            <div class="layout-controls">
                <div id="navbar-clock" class="navbar-clock" title="Local time (timezone aware)"></div>
                <!-- Single layout menu trigger: opens dropdown containing layout choices -->
                    <div id="layout-menu" style="position:relative; display:inline-block;">
                    <button id="layout-menu-trigger" class="layout-btn" title="Layouts">
                        <!-- simple grid icon -->
                        <span id="layout-menu-icon">▦</span>
                    </button>
                    <!-- NOTE: dropdown is created dynamically on first click to avoid flashing during load/refresh -->
                </div>
            </div>
            <div class="settings-controls" style="display:flex;align-items:center;gap:8px;">
                <button id="chart-type-switch" class="layout-btn" title="Footprint" aria-label="Footprint">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <!-- Slider-style icon: three vertical sliders with knobs centered -->
                        <rect x="4" y="3" width="2" height="9" fill="currentColor" rx="1" />
                        <!-- knob: outlined ring with inner dot for higher contrast -->
                        <g transform="translate(5,7)">
                            <circle r="1.8" fill="none" stroke="rgba(209,212,220,0.22)" stroke-width="1.0" />
                            <circle r="0.9" fill="#505564ff" />
                        </g>

                        <rect x="11" y="7" width="2" height="10" fill="currentColor" rx="1" />
                        <!-- knob: outlined ring with inner dot for higher contrast -->
                        <g transform="translate(12,12)">
                            <circle r="1.8" fill="none" stroke="rgba(209,212,220,0.22)" stroke-width="1.0" />
                            <circle r="0.9" fill="#505564ff" />
                        </g>

                        <rect x="18" y="2" width="2" height="15" fill="currentColor" rx="1" />
                        <!-- knob: outlined ring with inner dot for higher contrast -->
                        <g transform="translate(19,9.5)">
                            <circle r="1.8" fill="none" stroke="rgba(209,212,220,0.22)" stroke-width="1.0" />
                            <circle r="0.9" fill="#505564ff" />
                        </g>
                    </svg>
                </button>

                <button id="drawing-tool-btn" class="layout-btn" title="Rectangle (Ctrl+R)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/>
                    </svg>
                </button>
                <button id="horizontal-line-tool-btn" class="layout-btn" title="Horizontal Line (Ctrl+E)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </button>
                <button id="clear-drawings-btn" class="layout-btn" title="Clear Drawings" aria-label="Clear drawings">
                    <!-- Trash can icon copied from drawing-tool.js -->
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="color: #F23645;" aria-hidden="true">
                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"/>
                    </svg>
                </button>
                <button id="low-volume-toggle-btn" class="layout-btn" title="Low Volume Marker (Ctrl+X)" aria-label="Toggle Low Volume Marker">
                    <!-- Low volume icon: battery with low level -->
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <rect x="2" y="8" width="14" height="8" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        <rect x="17" y="10" width="3" height="4" rx="0.5" fill="currentColor"/>
                        <!-- Low volume indicator bars (only 1 bar showing low) -->
                        <rect x="4" y="11" width="2" height="2" fill="currentColor"/>
                        <rect x="7" y="10" width="2" height="4" fill="currentColor" opacity="0.3"/>
                        <rect x="10" y="9" width="2" height="6" fill="currentColor" opacity="0.3"/>
                    </svg>
                </button>
                <button id="settings-btn" class="settings-btn" title="Settings">
                    <span class="settings-icon">⚙️</span>
                </button>
            </div>
        </div>
    `;

    document.body.prepend(navbar);

    // Layout button event handling will be set up in chart.js
    // to ensure proper state management and persistence

    // Setup settings button
    const settingsBtn = navbar.querySelector('#settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', showSettingsPopup);
    }

    // Chart type switcher button: normal click toggles chart type, shift+click opens settings popup
    const chartTypeBtn = navbar.querySelector('#chart-type-switch');
    if (chartTypeBtn) {
        chartTypeBtn.addEventListener('click', (e) => {
            if (e.shiftKey) {
                // Show footprint settings popup
                let popup = document.getElementById('chart-settings-popup');
                if (popup) return; // Already open
                popup = document.createElement('div');
                popup.id = 'chart-settings-popup';
                popup.style.position = 'absolute';
                // Position near the icon, but keep inside viewport
                const rect = chartTypeBtn.getBoundingClientRect();
                const popupWidth = 190; // slightly smaller
                const popupHeight = 100; // slightly smaller
                let left = rect.left;
                let top = rect.bottom + 6;
                // If popup would overflow right, align its right edge with icon's right edge
                if (left + popupWidth > window.innerWidth - 8) {
                    left = rect.right - popupWidth;
                }
                if (left < 8) left = 8;
                // Clamp top so popup doesn't overflow bottom edge
                if (top + popupHeight > window.innerHeight - 8) {
                    top = window.innerHeight - popupHeight - 8;
                }
                if (top < 8) top = 8;
                popup.style.top = `${top}px`;
                popup.style.left = `${left}px`;
                popup.style.background = '#23263A';
                popup.style.color = '#B2B5BE';
                popup.style.border = '1px solid #23263A';
                popup.style.borderRadius = '8px';
                popup.style.padding = '10px 10px 8px 10px';
                popup.style.zIndex = '2000';
                popup.style.boxShadow = '0 2px 16px rgba(0,0,0,0.18)';
                popup.style.width = '190px';
                popup.style.minWidth = '0';
                popup.style.maxWidth = '90vw';
                popup.innerHTML = `
                    <div style="font-size:13px;font-weight:600;margin-bottom:8px;text-align:center;">Footprint Settings</div>
                    <div style="margin-bottom:8px;display:flex;flex-direction:column;gap:6px;">
                        <div style="display:flex;align-items:center;justify-content:space-between;">
                            <label for="popup-bucket-size-input" style="font-size:11px;color:#B2B5BE;">Tick Size:</label>
                            <input id="popup-bucket-size-input" type="number" step="0.01" min="0.01" value="0.05" style="width:72px;max-width:72px;font-size:11px;padding:4px 6px;height:26px;box-sizing:border-box;border-radius:2px;border:1px solid #363C4E;background:#181A20;color:#D1D4DC;text-align:right;">
                        </div>
                        <div style="display:flex;align-items:center;justify-content:space-between;">
                            <label for="popup-multiplier-input" style="font-size:11px;color:#B2B5BE;">Multiplier</label>
                            <input id="popup-multiplier-input" type="number" step="1" min="1" value="100" style="width:72px;max-width:72px;font-size:11px;padding:4px 6px;height:26px;box-sizing:border-box;border-radius:2px;border:1px solid #363C4E;background:#181A20;color:#D1D4DC;text-align:right;">
                        </div>
                    </div>
                    <div style="display:flex;justify-content:flex-end;gap:6px;">
                        <button id="close-chart-settings-btn" style="background:#363C4E;color:#fff;border:none;border-radius:2px;padding:4px 10px;font-size:11px;cursor:pointer;">Close</button>
                        <button id="apply-chart-settings-btn" style="background:#2962FF;color:#fff;border:none;border-radius:2px;padding:4px 10px;font-size:11px;cursor:pointer;">Apply</button>
                    </div>
                `;
                document.body.appendChild(popup);
                // Set current values from chart (if available)
                const bucketInput = popup.querySelector('#popup-bucket-size-input');
                const multiplierInput = popup.querySelector('#popup-multiplier-input');
                // Prefill with current chart settings from chart.js
                try {
                    // Ensure we get the correct selected chart index
                    let selectedIdx = window.selectedChartIndex || 0;

                    // Get the selected chart ID using the correct index
                    const chartId = 'chart-' + selectedIdx;

                    // Define function to update inputs with chart settings
                    function updateFootprintInputs(chartId) {
                        const saved = localStorage.getItem('chartSettings_' + chartId);
                        if (saved) {
                            const obj = JSON.parse(saved);
                            if (typeof obj.bucket_size === 'number') bucketInput.value = obj.bucket_size;
                            if (typeof obj.multiplier === 'number') multiplierInput.value = obj.multiplier;
                        } else {
                            // If no saved settings, get them from chart registry if available
                            const idx = parseInt(chartId.split('-')[1]);
                            if (window.chartRegistry && window.chartRegistry[idx]) {
                                const chartObj = window.chartRegistry[idx];
                                if (typeof chartObj.bucket_size === 'number') bucketInput.value = chartObj.bucket_size;
                                if (typeof chartObj.multiplier === 'number') multiplierInput.value = chartObj.multiplier;
                            }
                        }
                    }

                    // Initial update with current chart settings
                    updateFootprintInputs(chartId);

                    // Listen for chart selection changes while popup is open
                    function chartSelectionListener(e) {
                        // Update inputs when selected chart changes
                        const newChartId = 'chart-' + (window.selectedChartIndex || 0);
                        updateFootprintInputs(newChartId);
                    }

                    // Add event listener for chart selection changes
                    document.addEventListener('chartSelected', chartSelectionListener);

                    // Store the listener so we can remove it when popup closes
                    popup._chartSelectionListener = chartSelectionListener;

                } catch (err) {
                    console.warn('Error loading chart settings for footprint popup:', err);
                }
                // Apply button
                popup.querySelector('#apply-chart-settings-btn').onclick = () => {
                    const bucket_size = parseFloat(bucketInput.value);
                    const multiplier = parseInt(multiplierInput.value);
                    document.dispatchEvent(new CustomEvent('chartSettingsChanged', {
                        detail: { bucket_size, multiplier }
                    }));
                    popup.remove();
                    document.removeEventListener('keydown', escListener);
                    // Remove chart selection listener if it exists
                    if (popup._chartSelectionListener) {
                        document.removeEventListener('chartSelected', popup._chartSelectionListener);
                    }
                };
                // Close button
                popup.querySelector('#close-chart-settings-btn').onclick = () => {
                    popup.remove();
                    document.removeEventListener('keydown', escListener);
                    // Remove chart selection listener if it exists
                    if (popup._chartSelectionListener) {
                        document.removeEventListener('chartSelected', popup._chartSelectionListener);
                    }
                };
                // Enter key applies settings and closes popup
                function enterListener(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const bucket_size = parseFloat(bucketInput.value);
                        const multiplier = parseInt(multiplierInput.value);
                        document.dispatchEvent(new CustomEvent('chartSettingsChanged', {
                            detail: { bucket_size, multiplier }
                        }));
                        popup.remove();
                        document.removeEventListener('keydown', escListener);
                        document.removeEventListener('keydown', enterListener);
                        // Remove chart selection listener if it exists
                        if (popup._chartSelectionListener) {
                            document.removeEventListener('chartSelected', popup._chartSelectionListener);
                        }
                    }
                }
                document.addEventListener('keydown', enterListener);
                // ESC key closes popup
                function escListener(e) {
                    if (e.key === 'Escape') {
                        if (popup && document.body.contains(popup)) {
                            popup.remove();
                            document.removeEventListener('keydown', escListener);
                            document.removeEventListener('keydown', enterListener);
                            // Remove chart selection listener if it exists
                            if (popup._chartSelectionListener) {
                                document.removeEventListener('chartSelected', popup._chartSelectionListener);
                            }
                        }
                    }
                }
                document.addEventListener('keydown', escListener);
            } else {
                // Normal click: toggle chart type
                document.dispatchEvent(new CustomEvent('chartTypeSwitch', {}));
            }
        });
    }

    // Setup drawing tool button
    const drawingToolBtn = navbar.querySelector('#drawing-tool-btn');
    const horizontalLineBtn = navbar.querySelector('#horizontal-line-tool-btn');

    if (drawingToolBtn) {
        drawingToolBtn.addEventListener('click', () => {
            const chartObj = window.chartRegistry?.[window.selectedChartIndex || 0];
            if (chartObj?.rectangleDrawingTool) {
                // If horizontal line mode is active, disable rectangle tool
                if (horizontalLineBtn?.classList.contains('active')) {
                    return; // Do nothing if horizontal line tool is active
                }
                chartObj.rectangleDrawingTool.setDrawingMode('rectangle');
                if (chartObj.rectangleDrawingTool.isDrawing()) {
                    chartObj.rectangleDrawingTool.stopDrawing();
                    drawingToolBtn.classList.remove('active');
                    drawingToolBtn.style.background = '';
                } else {
                    chartObj.rectangleDrawingTool.startDrawing();
                    drawingToolBtn.classList.add('active');
                    drawingToolBtn.style.background = '#2962FF';
                }
            }

        });
    }

    if (horizontalLineBtn) {
        horizontalLineBtn.addEventListener('click', () => {
            const chartObj = window.chartRegistry?.[window.selectedChartIndex || 0];
            if (chartObj?.rectangleDrawingTool) {
                // If rectangle tool is active, disable horizontal line tool
                if (drawingToolBtn?.classList.contains('active')) {
                    return; // Do nothing if rectangle tool is active
                }
                chartObj.rectangleDrawingTool.setDrawingMode('horizontalLine');
                if (chartObj.rectangleDrawingTool.isDrawing()) {
                    chartObj.rectangleDrawingTool.stopDrawing();
                    horizontalLineBtn.classList.remove('active');
                    horizontalLineBtn.style.background = '';
                } else {
                    chartObj.rectangleDrawingTool.startDrawing();
                    horizontalLineBtn.classList.add('active');
                    horizontalLineBtn.style.background = '#2962FF';
                }
            }
        });
    }

    // Register clear-drawings button once (outside other handlers) so it always works
    const clearDrawingsBtn = navbar.querySelector('#clear-drawings-btn');
    if (clearDrawingsBtn) {
        clearDrawingsBtn.addEventListener('click', () => {
            const chartObj = window.chartRegistry?.[window.selectedChartIndex || 0];
            if (!chartObj || !chartObj.rectangleDrawingTool) return;
            const symbol = chartObj.symbol || chartObj?.container?.dataset?.symbol || 'current symbol';
            if (!confirm(`Clear all drawings for ${symbol}? This cannot be undone.`)) return;
            try {
                chartObj.rectangleDrawingTool.clearAllDrawings();
                // Update UI buttons
                document.dispatchEvent(new CustomEvent('chartSelected'));
            } catch (err) {
                console.warn('Failed to clear drawings via navbar button', err);
            }
        });
    }

    // Register low volume toggle button
    const lowVolumeToggleBtn = navbar.querySelector('#low-volume-toggle-btn');
    if (lowVolumeToggleBtn) {
        lowVolumeToggleBtn.addEventListener('click', () => {
            toggleLowVolumeMarker();
        });
    }

    // Setup layout menu dropdown toggle and outside-click handler
    const layoutMenuTrigger = navbar.querySelector('#layout-menu-trigger');
    // The dropdown will be created dynamically on first click to avoid flashing during load/refresh
    let layoutMenuDropdown = null;
    let layoutDropdownDocClickHandler = null;

    if (layoutMenuTrigger) {
        layoutMenuTrigger.addEventListener('click', (e) => {
            e.stopPropagation();

            // Create dropdown lazily
            if (!layoutMenuDropdown) {
                layoutMenuDropdown = document.createElement('div');
                layoutMenuDropdown.id = 'layout-menu-dropdown';
                layoutMenuDropdown.className = 'layout-menu-dropdown';
                Object.assign(layoutMenuDropdown.style, {
                    display: 'none',
                    position: 'fixed',
                    background: '#1B1D22',
                    border: '1px solid #2E323B',
                    padding: '6px',
                    zIndex: '200',
                    flexDirection: 'row',
                    gap: '8px',
                    borderRadius: '6px'
                });

                // Keep inner buttons with original ids so chart.js handlers remain compatible
                const defs = [
                    { id: 'layout-1', title: 'Single Chart', text: '1' },
                    { id: 'layout-2', title: 'Two Charts Side by Side', text: '2' },
                    { id: 'layout-3', title: 'Three Charts Row', text: '3' },
                    { id: 'layout-4', title: 'Four Charts Grid', text: '4' },
                    { id: 'layout-5', title: 'Split left / right split (50/50 left, right split)', text: 'S' }
                ];

                defs.forEach(d => {
                    const btn = document.createElement('button');
                    btn.id = d.id;
                    btn.className = 'layout-btn';
                    btn.title = d.title;
                    btn.textContent = d.text;
                    // Dispatch an event that chart.js listens for so layout switching works even though
                    // the buttons are created dynamically after chart.js initialized.
                    btn.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        const parts = d.id.split('-');
                        const num = parseInt(parts[1], 10) || 1;
                        if (num === 5) {
                            document.dispatchEvent(new CustomEvent('requestLayoutVariant', { detail: { numCharts: 3, variant: 'split-right' } }));
                        } else {
                            document.dispatchEvent(new CustomEvent('requestLayoutVariant', { detail: { numCharts: num } }));
                        }
                        layoutMenuDropdown.style.display = 'none';
                    });
                    layoutMenuDropdown.appendChild(btn);
                });

                // Prevent clicks inside from bubbling to document
                layoutMenuDropdown.addEventListener('click', (ev) => ev.stopPropagation());

                document.body.appendChild(layoutMenuDropdown);
                // Defensive: ensure dropdown is hidden after creation so first click opens it
                layoutMenuDropdown.style.display = 'none';

                // Outside click closes dropdown
                layoutDropdownDocClickHandler = (ev) => {
                    if (!layoutMenuDropdown) return;
                    if (ev.target === layoutMenuTrigger) return;
                    if (!layoutMenuDropdown.contains(ev.target)) {
                        layoutMenuDropdown.style.display = 'none';
                    }
                };
                document.addEventListener('click', layoutDropdownDocClickHandler);
            }

            const isOpen = layoutMenuDropdown.style.display !== 'none';
            layoutMenuDropdown.style.display = isOpen ? 'none' : 'flex';
            layoutMenuDropdown.style.flexDirection = 'row';
            layoutMenuDropdown.style.gap = '6px';
            // position dropdown vertically under the trigger and align top-left corner with the trigger
            const rect = layoutMenuTrigger.getBoundingClientRect();
            // set top and left using viewport coordinates (position:fixed)
            layoutMenuDropdown.style.top = `${rect.bottom + 6}px`;
            layoutMenuDropdown.style.left = `${rect.left}px`;
            // clamp to viewport so the dropdown doesn't overflow
            requestAnimationFrame(() => {
                const dd = layoutMenuDropdown.getBoundingClientRect();
                if (dd.right > window.innerWidth - 8) {
                    layoutMenuDropdown.style.left = `${Math.max(8, rect.right - dd.width)}px`;
                }
                if (dd.bottom > window.innerHeight - 8) {
                    layoutMenuDropdown.style.top = `${Math.max(8, rect.top - dd.height - 6)}px`;
                }
            });
        });
    }

    // Listen for chart selection changes to update button states
    document.addEventListener('chartSelected', () => {
        const chartObj = window.chartRegistry?.[window.selectedChartIndex || 0];
        if (chartObj?.rectangleDrawingTool) {
            const isDrawing = chartObj.rectangleDrawingTool.isDrawing();
            const drawingMode = chartObj.rectangleDrawingTool.getDrawingMode();

            // Update rectangle tool button
            if (drawingToolBtn) {
                const isRectangleActive = isDrawing && drawingMode === 'rectangle';
                drawingToolBtn.classList.toggle('active', isRectangleActive);
                drawingToolBtn.style.background = isRectangleActive ? '#2962FF' : '';
            }

            // Update horizontal line tool button
            if (horizontalLineBtn) {
                const isHorizontalLineActive = isDrawing && drawingMode === 'horizontalLine';
                horizontalLineBtn.classList.toggle('active', isHorizontalLineActive);
                horizontalLineBtn.style.background = isHorizontalLineActive ? '#2962FF' : '';
            }
        } else {
            // No drawing tool available, deactivate both buttons
            if (drawingToolBtn) {
                drawingToolBtn.classList.remove('active');
                drawingToolBtn.style.background = '';
            }
            if (horizontalLineBtn) {
                horizontalLineBtn.classList.remove('active');
                horizontalLineBtn.style.background = '';
            }
        }

        // Update low volume marker button state based on chart-specific settings
        const lowVolumeToggleBtn = document.getElementById('low-volume-toggle-btn');
        if (lowVolumeToggleBtn) {
            try {
                const chartId = 'chart-' + (window.selectedChartIndex || 0);
                const saved = localStorage.getItem('chartSettings_' + chartId);
                let shouldShow = false;

                if (saved) {
                    const obj = JSON.parse(saved);
                    shouldShow = obj.showLowVolumeMarker || false;
                }

                isLowVolumeMarkerVisible = shouldShow;
                lowVolumeToggleBtn.classList.toggle('active', shouldShow);
                lowVolumeToggleBtn.style.background = shouldShow ? '#2962FF' : '';
            } catch (err) {
                console.warn('Error updating low volume marker button state:', err);
            }
        }
    });


    // Setup navbar toggle functionality
    setupNavbarToggle();
}

// --- Timezone-aware navbar clock ---
function getClockSettings() {
    try {
        const obj = JSON.parse(localStorage.getItem('chartSettings') || '{}');
        return {
            timezone: obj.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            use12Hour: obj.timeFormat === '12h'
        };
    } catch (e) {
        return { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', use12Hour: false };
    }
}

let _clockInterval = null;
function startNavbarClock() {
    const el = document.getElementById('navbar-clock');
    if (!el) return;
    if (_clockInterval) clearInterval(_clockInterval);
    const { timezone, use12Hour } = getClockSettings();

    function update() {
        const now = new Date();
        try {
            const fmt = new Intl.DateTimeFormat(undefined, {
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !!use12Hour, timeZone: timezone
            });
            el.textContent = fmt.format(now);
            el.title = `${timezone} (${use12Hour ? '12h' : '24h'})`;
        } catch (e) {
            // Fallback: show local time
            el.textContent = now.toLocaleTimeString();
            el.title = timezone;
        }
    }

    update();
    _clockInterval = setInterval(update, 1000);
}

// Restart clock when settings change
document.addEventListener('settingsApplied', () => {
    startNavbarClock();
});

// Start clock on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    startNavbarClock();
});


// Store low volume marker visibility state
let isLowVolumeMarkerVisible = false;

// Function to toggle low volume marker
export function toggleLowVolumeMarker() {
    const lowVolumeToggleBtn = document.getElementById('low-volume-toggle-btn');
    if (!lowVolumeToggleBtn) return;

    isLowVolumeMarkerVisible = !isLowVolumeMarkerVisible;

    // Update button appearance
    if (isLowVolumeMarkerVisible) {
        lowVolumeToggleBtn.classList.add('active');
        lowVolumeToggleBtn.style.background = '#2962FF';
        document.body.classList.add('hide-low-volume');
    } else {
        lowVolumeToggleBtn.classList.remove('active');
        lowVolumeToggleBtn.style.background = '';
        document.body.classList.remove('hide-low-volume');
    }

    // Save state to localStorage for current chart
    try {
        const chartId = 'chart-' + (window.selectedChartIndex || 0);
        const saved = localStorage.getItem('chartSettings_' + chartId);
        const settings = saved ? JSON.parse(saved) : {};
        settings.showLowVolumeMarker = isLowVolumeMarkerVisible;
        localStorage.setItem('chartSettings_' + chartId, JSON.stringify(settings));
    } catch (err) {
        console.warn('Error saving low volume marker state:', err);
    }

    // Dispatch event for other components to handle the toggle
    document.dispatchEvent(new CustomEvent('lowVolumeMarkerToggled', {
        detail: { visible: isLowVolumeMarkerVisible }
    }));

    // Trigger chart refresh to apply changes
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
}

// Function to robustly toggle navbar visibility and always restore layout correctly

export function toggleNavbarVisibility() {
    const navbar = document.getElementById('main-navbar');
    const chartsGrid = document.querySelector('.charts-grid');
    if (!navbar) return;

    isNavbarVisible = !isNavbarVisible;

    // Set navbar style
    navbar.style.transition = 'transform 0.3s cubic-bezier(.4,0,.2,1)';
    navbar.style.transform = isNavbarVisible ? 'translateY(0)' : 'translateY(-40px)';
    navbar.style.zIndex = '1000';

    // Set grid style
    if (chartsGrid) {
        chartsGrid.style.transition = 'top 0.3s cubic-bezier(.4,0,.2,1), height 0.3s cubic-bezier(.4,0,.2,1)';
        chartsGrid.style.top = isNavbarVisible ? '40px' : '0';
        chartsGrid.style.height = isNavbarVisible ? 'calc(100vh - 40px)' : '100vh';
    }

    // Remove any existing reveal buttons (cleanup)
    const revealBtn = document.getElementById('navbar-reveal-btn');
    if (revealBtn) revealBtn.remove();

    // Only one event, after transition, for chart resize
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('navbarToggled', { detail: { visible: isNavbarVisible } }));
        requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    }, 320);
}

export function injectStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        :root {
            --bg-primary: #131722;
            --bg-secondary: #1E222D;
            --bg-element: #2A2E39;
            --bg-hover: #363C4E;
            --text-primary: #D1D4DC;
            --text-secondary: #787B86;
            --accent-blue: #2962FF;
            --accent-green: #22ab94;
            --accent-red: #f7525f;
            --border-color: #23263A;
        }
        
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 13px;
        }
        
        .charts-grid {
            position: absolute;
            top: 40px;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100vw;
            height: calc(100vh - 40px);
            display: grid;
            background: var(--bg-primary);
            gap: 1px;
            transition: top 0.3s ease, height 0.3s ease;
        }
        
        .chart-container {
            width: 100%;
            height: 100%;
            background: var(--bg-secondary);
            overflow: hidden;
        }
        
        nav {
            user-select: none;
            background: var(--bg-secondary) !important;
            color: var(--text-primary) !important;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            border-bottom: 1px solid var(--border-color);
            height: 40px !important;
            min-height: 40px !important;
            max-height: 40px !important;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 13px;
            transition: transform 0.3s ease;
            transform: translateY(0);
        }
        
        .navbar-section {
            display: flex;
            align-items: center;
            height: 100%;
        }
        
        #navbar-left {
            padding-left: 8px;
            gap: 16px;
            flex: 1 1 auto;
        }
        
        #navbar-right {
            padding-right: 8px;
            gap: 8px;
            flex-shrink: 0;
        }
        
        .symbol-container {
            display: flex;
            align-items: center;
            gap: 6px;
            height: 100%;
            padding: 0 12px;
            cursor: pointer;
            border-right: 1px solid var(--border-color);
        }
        
        .symbol-container:hover {
            background: var(--bg-hover);
        }
        
        .search-icon {
            font-size: 14px;
            color: var(--text-secondary);
        }
        
        .current-symbol {
            font-weight: 600;
            font-size: 14px;
        }
        
        .timeframe-container {
            display: flex;
            align-items: center;
            height: 100%;
            gap: 2px;
            padding: 0 8px;
        }
        
        .layout-controls {
            display: flex;
            align-items: center;
            height: 100%;
            gap: 2px;
            padding: 0 4px 0 12px;
            border-left: 1px solid var(--border-color);
        }
        
        .settings-controls {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 8px 0 8px;
        }
        
        /* Common button styles */
        .layout-btn,
        .tf-btn,
        .navbar-toggle-btn,
        .settings-btn {
            background: var(--bg-element);
            color: var(--text-primary);
            border: none;
            border-radius: 2px;
            cursor: pointer;
            transition: background 0.15s;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        
        .layout-btn:hover,
        .tf-btn:hover,
        .navbar-toggle-btn:hover,
        .settings-btn:hover {
            background: var(--bg-hover);
        }
        
        .layout-btn.active,
        .tf-btn.active {
            background: var(--accent-blue);
        }
        
        /* Specific styles */
        .layout-btn,
        .settings-btn {
            width: 24px;
            height: 24px;
        }
        
        .settings-icon {
            font-size: 14px;
        }
        
        .tf-btn {
            padding: 2px 8px;
        }
        
        /* Navbar toggle button styles */
        .navbar-toggle-container {
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 8px 0 12px;
            border-left: 1px solid var(--border-color);
        }
        
        .navbar-toggle-btn {
            width: 28px;
            height: 28px;
            transition: all 0.15s ease;
        }
        
        .navbar-toggle-btn:hover {
            transform: translateY(1px);
        }
        
        .toggle-icon {
            display: inline-block;
            transition: transform 0.2s ease;
        }
        
        .navbar-toggle-btn:hover .toggle-icon {
            transform: translateY(1px);
        }
        
        /* CSS for navbar reveal button removed */

    /* Styles for chart settings popup inputs to ensure consistent sizing and hide native spinners */
        #chart-settings-popup input[type=number] {
            -moz-appearance: textfield; /* Firefox: remove spinner */
            appearance: textfield;
            padding-right: 6px; /* space for any browser UI */
            height: 26px;
            line-height: 1;
            box-sizing: border-box;
            font-size: 11px;
            text-align: right;
            border-radius: 2px;
            border: 1px solid #363C4E;
            background: #181A20;
            color: #D1D4DC;
        }

        /* Navbar clock (styled like previous label) */
        .navbar-clock {
            font-family: monospace;
            font-size: 12px;
            color: var(--text-secondary);
            padding-left: 8px;
            padding-right: 8px;
            display: inline-flex;
            align-items: center;
            height: 100%;
            white-space: nowrap;
            min-width: 64px;
            margin-right: 6px; /* similar spacing as the removed label */
        }

        /* WebKit browsers - hide the up/down arrows */
        #chart-settings-popup input[type=number]::-webkit-outer-spin-button,
        #chart-settings-popup input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        /* Ensure labels and controls align nicely */
        #chart-settings-popup label {
            display: inline-block;
            margin-right: 8px;
            min-width: 56px;
            text-align: left;
        }

        /* CSS for hiding low volume footprint cells */
        .hide-low-volume .footprint-cell.low-volume {
            opacity: 0 !important;
            pointer-events: none !important;
        }

        .hide-low-volume .footprint-cell.low-volume .volume-text {
            display: none !important;
        }

        /* Low volume marker button active state */
        #low-volume-toggle-btn.active {
            background: #2962FF !important;
        }

        /* Store reference for dynamic low volume cell identification */
        .footprint-cell {
            transition: opacity 0.2s ease;
        }

        .footprint-cell.low-volume {
            /* Will be identified and controlled by the footprint renderer */
        }
	`;
    document.head.appendChild(style);

    // Also inject settings styles
    injectSettingsStyles();
}
