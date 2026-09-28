/**
 * MOAZ HANY ELBAKHSHA — PORTFOLIO CORE APPLICATION JAVASCRIPT
 * Handles project filtering, interactive modal deep dives, copy-to-clipboard,
 * and user review assistant interactions.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Project Detailed Data Store ---
  const projectDetails = {
    'stm32h7-mainboard': {
      title: '4-Layer STM32H7 Central Robotics Mainboard (UTM RBC 24/25)',
      category: 'PCB & Hardware Engineering',
      image: 'assets/stm32h7-mainboard.png',
      specs: [
        { label: 'Processor', value: 'STM32H7 ARM Cortex-M7 (480 MHz Speed Upgrade)' },
        { label: 'PCB Stackup', value: '4-Layer High-Density, Solid GND Planes' },
        { label: 'Fieldbus', value: '3x Isolated CAN Bus (Added Channel to Stop Crashes)' },
        { label: 'Power Protection', value: 'Texas Instruments TPS eFuse + Reverse Polarity' },
        { label: 'Motion & Actuation', value: '6x High-Speed PWM + Dual QEI Quadrature' },
        { label: 'EDA Environment', value: 'Altium Designer (DFM Verified)' }
      ],
      description: 'Engineered as the central processing brain for the UTM Robocon autonomous competition robots competing at national and international levels (ABU Robocon). Upgraded specifically to eliminate processing latency and fieldbus crashes experienced on earlier robot hardware revisions.',
      challenges: [
        {
          title: 'Compute Bottleneck: Legacy IC Processing Saturation & Loop Latency',
          problem: 'The previous robot controller utilized an older, lower-clocked microcontroller (STM32F4 series) that suffered from severe CPU saturation under peak competition loads. Concurrently executing high-rate multi-motor kinematics, sensor data parsing, and real-time state machines introduced non-deterministic execution delays exceeding 15 ms, creating control loop lag and motor trajectory jitter.',
          solution: 'Identified the execution bottleneck and upgraded the architecture to the ultra-high-performance <strong>STM32H7 ARM Cortex-M7 operating at 480 MHz</strong>, featuring a double-precision Floating-Point Unit (FPU) and 32KB L1 instruction/data cache. Slashed kinematic loop cycle times to under 1.2 ms (over 90% latency reduction), eliminating timing jitter and enabling deterministic real-time multi-tasking.'
        },
        {
          title: 'Fieldbus Congestion: Signal Collisions & Fatal CAN Bus-Off Crashes',
          problem: 'During high-speed competition maneuvers, continuous high-frequency motor velocity feedback, encoder positions, and sensor packets were multiplexed across only two shared CAN channels. This triggered severe bus arbitration contention, Transmit/Receive Error Counter (TEC/REC) overflows, and fatal CAN Bus-Off shutdowns that halted the robot mid-match.',
          solution: 'Re-architected the fieldbus topology by integrating an additional <strong>3rd dedicated, hardware-isolated CAN transceiver channel (expanding to 3x independent CAN buses: CAN1, CAN2, CAN3)</strong> with isolated ground planes and split 120Ω terminations. High-frequency motor actuation was isolated exclusively onto CAN1, leaving CAN2 and CAN3 dedicated to real-time sensor telemetry and safety interlocks. This eliminated packet contention, completely prevented bus-off crashes, and achieved 100% telemetry transmission reliability under peak load.'
        }
      ],
      highlights: [
        '<strong>480 MHz Core Processing Upgrade:</strong> Replaced the slow legacy MCU with an STM32H7 Cortex-M7 operating at 480 MHz with FPU to execute intensive kinematics with zero execution latency.',
        '<strong>3x Isolated CAN Bus Architecture:</strong> Added a 3rd dedicated hardware CAN channel to eliminate signal congestion and prevent catastrophic CAN bus crashes.',
        '<strong>Robust Power Integrity:</strong> Integrated TI TPS electronic fuse circuitry with reverse-polarity protection, driving dual low-noise LDO voltage regulators for sensitive 3.3V analog and digital rails.',
        '<strong>Motion I/O & Encoders:</strong> Broken out dual Quadrature Encoder Interfaces (QEI) and 6x PWM timer channels for closed-loop multi-motor locomotion control.',
        '<strong>Manufacturing Yield (DFM):</strong> Handled full Gerber generation (RS-274X), NC drill, 3D STEP modeling, and BOM optimization for rapid turnaround and surface mount assembly.'
      ]
    },

    'greenhouse-robot': {
      title: 'Autonomous Navigation & Control System for Greenhouse Mobile Robot (FYP)',
      category: 'Robotics & Autonomous Systems',
      image: 'assets/capstone_robot/robot_corridor_test.png',
      specs: [
        { label: 'Platform Framework', value: 'ROS2 / Python / C++' },
        { label: 'Sensor Suite', value: '4x HC-SR04 Sonar, MPU6050 6-DOF IMU, Encoders' },
        { label: 'Control Loop', value: 'Deterministic Dual-PID Heading & Centering' },
        { label: 'Low-Level Controller', value: 'Arduino Uno / Mega (PWM Driver)' },
        { label: 'High-Level Compute', value: 'Host PC / SBC running ROS2 Navigation Stack' },
        { label: 'Path Maneuvers', value: 'Row-Following, 90° Turn, 160° Obstacle U-Turn' }
      ],
      description: 'Differential-drive autonomous mobile robot platform engineered for agricultural row-following and greenhouse corridor navigation. Built with a distributed architecture: deterministic sensor sampling and PWM motor driving on the microcontroller, paired with a ROS2 state machine executing multi-row traversal and obstacle recovery.',
      challenges: [
        {
          title: 'Heading Drift & Odometry Slip on Loose Greenhouse Soil',
          problem: 'Wheel slippage on loose, uneven soil caused open-loop encoder odometry to accumulate angular heading drift, causing the robot to veer off-center toward crop boundaries during long corridor runs.',
          solution: 'Engineered a dual-PID sensor fusion loop integrating a 4x ultrasonic sonar distance array with an MPU6050 6-DOF IMU and wheel encoders. Dynamically balanced lateral corridor error and commanded real-time heading corrections to maintain center-row alignment.'
        }
      ],
      highlights: [
        '<strong>Sensor Fusion & Drift Elimination:</strong> Combined 4x ultrasonic distance arrays with an MPU6050 6-DOF IMU and rotary encoders into a dual-PID control loop that eliminates diagonal drift down narrow crop rows.',
        '<strong>Autonomous State Machine:</strong> Designed a ROS2 finite state machine handling automatic row-end detection, 90-degree adjacent-row switching, and 160-degree obstacle-avoidance recovery maneuvers.',
        '<strong>Distributed Control Architecture:</strong> Distributed compute tasks: high-level state planning on ROS2 paired with deterministic low-level motor execution on the microcontroller via USB serial communication.',
        '<strong>Fail-Safe Collision Avoidance:</strong> Continuous ultrasonic threshold monitoring triggering emergency deceleration and reversing upon detecting forward obstructions.'
      ]
    },

    'greenhouse-vision': {
      title: 'Edge AI Vision & Plant Disease Guidance System for Agricultural Robotics',
      category: 'Computer Vision & Edge AI',
      image: 'assets/capstone_robot/greenhouse_yolo_clear.jpg',
      specs: [
        { label: 'Model Architecture', value: 'YOLOv8 Nano (YOLOv8n) Deep Learning' },
        { label: 'Edge Inference Rate', value: '10 Hz Real-Time on Embedded Hardware' },
        { label: 'Detection Scope', value: '9 Crop Health/Disease Classes + Row Polybags' },
        { label: 'Guidance Metrics', value: 'Row Heading Angle, Path Width (m), Obstacles' },
        { label: 'Edge Target Hardware', value: 'Raspberry Pi 3B+ (picamera2 GPU Pipeline)' },
        { label: 'Deployment Status', value: 'Validated in Greenhouse (Decoupled from Chassis)' }
      ],
      description: 'Real-time edge computer vision pipeline engineered to provide autonomous agricultural robots with vision-based crop-row guidance, path-width calculation, and automated plant disease detection. Resolved path identification failures faced by earlier student iterations by using real-time crop polybag detection to construct virtual center-line trajectories between plant rows.',
      challenges: [
        {
          title: 'Unstructured Greenhouse Navigation: Visual Path & Row Centering Identification',
          problem: 'Previous students and earlier project iterations faced persistent difficulties identifying reliable navigation paths for the mobile robot inside the greenhouse. Conventional line-tracking sensors and classical thresholding failed completely because greenhouse furrows lack painted floor lines, suffer from uneven soil and foliage clutter, and experience harsh, fluctuating ambient sunlight shadows.',
          solution: 'Formulated an innovative visual guidance strategy that utilizes the crops themselves as natural geometric guides. Trained a custom YOLOv8 model to detect individual crop polybags and foliage in real time, computing regression boundary lines along both crop rows. By calculating the dynamic midline between both lines, the algorithm accurately extracts center heading angles (e.g. 92.7° alignment) and corridor path width (0.85m – 1.46m), enabling reliable autonomous steering directly between the plants.'
        },
        {
          title: 'Compute Bottleneck on Low-Power Single-Board Computer',
          problem: 'Standard PyTorch deep learning models overwhelmed the CPU of the Raspberry Pi 3B+, resulting in thermal throttling and frame rates dropping below 2 FPS, far too slow for real-time robotic guidance.',
          solution: 'Engineered an optimized edge inference pipeline utilizing YOLOv8n with GPU-accelerated video capture via picamera2 and thread-isolated frame grabbing. Achieved a steady 10 Hz inference rate with sub-100ms latency, enabling real-time navigation feedback.'
        }
      ],
      highlights: [
        '<strong>Lightweight Edge Inference:</strong> Built a custom PyTorch/YOLOv8 deep learning pipeline detecting 9 plant health/disease classes running at 10 Hz real-time on embedded hardware using picamera2 GPU acceleration.',
        '<strong>Dynamic Visual Geometry:</strong> Programmed real-time row geometry extraction calculating path center angle (e.g. 92.7° alignment) and corridor width (0.85m – 1.46m) for steering guidance.',
        '<strong>Forward Obstacle Alerts:</strong> Detected forward obstacles with confidence tags and computed dynamic steering clearance vectors (e.g. 21.5° steer-left alerts).',
        '<strong>Validated in Field Trials:</strong> Tested on real greenhouse chili crops, proving autonomous vision capabilities under natural variable illumination.'
      ]
    },

    'ethernet-can-gateway': {
      title: 'Industrial Ethernet-to-CAN Communication Gateway PCB',
      category: 'High-Speed PCB & Industrial Bus',
      image: 'assets/ethernet-can-gateway.png',
      specs: [
        { label: 'Microcontroller', value: 'STM32F107 32-bit ARM Cortex-M3' },
        { label: 'Differential Pairs', value: '100-Ohm Controlled Impedance (ETHER_TX/RX)' },
        { label: 'Physical Layer', value: 'Pulse J0011D21B RJ45 (Integrated Magnetics)' },
        { label: 'RMII Bus', value: 'Length-Matched High-Speed Routing' },
        { label: 'CAN Transceivers', value: 'Dual TJA1050 / TCAN334 with 120Ω Split Term.' },
        { label: 'Layers & Stackup', value: '4-Layer Low-EMI Board (ETH_PCB)' }
      ],
      description: 'Industrial-grade communication gateway bridging Ethernet network protocols with real-time CAN bus telemetry for robotic industrial telemetry.',
      challenges: [
        {
          title: 'Signal Reflection & Frame Dropouts on High-Speed Ethernet',
          problem: 'High-frequency Ethernet signals experienced reflection and packet degradation due to trace impedance mismatches and EMI radiated from adjacent switching power converters.',
          solution: 'Routed strict 100Ω controlled-impedance differential pairs for ETHER_TX/RX lines, strictly matched trace lengths across the RMII interface, and implemented TVS diode ESD clamps alongside split 120Ω CAN termination.'
        }
      ],
      highlights: [
        '<strong>Controlled Impedance:</strong> Calculated and routed strict 100-ohm differential pairs for high-speed Ethernet transmit/receive lines to prevent reflections and packet dropouts.',
        '<strong>Signal Integrity:</strong> Strict trace length matching across the RMII bus between the STM32F107 MCU and the Ethernet PHY chip.',
        '<strong>Fieldbus Termination:</strong> Dual CAN transceivers equipped with onboard 120-ohm differential split termination and TVS diode electrostatic discharge (ESD) suppression.',
        '<strong>Power Plane Partitioning:</strong> Sized 20-30 mil power traces and placed 0603 decoupling caps immediately adjacent to IC power pins.'
      ]
    },


    'vitrox-closed-loop': {
      title: 'Industrial Closed-Loop Illumination & Precision Moving Base (ViE Technologies)',
      category: 'Industrial Automation & QA Systems',
      image: null,
      specs: [
        { label: 'Host Organization', value: 'ViE Technologies (Penang)' },
        { label: 'Control Technique', value: 'Photodiode Dynamic PID Feedback' },
        { label: 'Motion Control', value: 'Encoder-Driven Precision Moving Base' },
        { label: 'Safety Protection', value: 'Hardware Limit Switches & Software Bounds' },
        { label: 'Software Stack', value: 'Python Automation UI + Arduino Firmware' },
        { label: 'QA Target', value: 'X-Ray Protective Glass Light Transmittance' }
      ],
      description: 'Automated test engineering project developed within the Camera Team at ViE Technologies for automated machine vision QA and optical characterization.',
      challenges: [
        {
          title: 'Thermal Lux Drift & Non-Linear Light Decay During Testing',
          problem: 'Inspection illumination sources decayed non-linearly over prolonged duty cycles due to thermal buildup, requiring repetitive and costly manual recalibrations by production technicians.',
          solution: 'Engineered a closed-loop photodiode optical sensor circuit with dynamic Python PID feedback that autonomously adjusts programmable power supplies in real time, maintaining consistent luminous flux.'
        }
      ],
      highlights: [
        '<strong>Closed-Loop Illumination:</strong> Designed photodiode optical feedback compensating for non-linear light intensity decay over operating temperatures, eliminating manual technician calibration.',
        '<strong>Precision Motion Base:</strong> Engineered an encoder-driven motorized moving base with dual hardware limit switches, ensuring repeatable optical camera sensor positioning.',
        '<strong>X-Ray Glass QA Station:</strong> Programmed the complete Python automation control software interfacing hardware actuators, power supplies, and light meters to evaluate optical transparency.',
        '<strong>Production Deployment:</strong> Drafted wiring schematics, component selection rationale, and customized user-friendly calibration GUIs for production technicians.'
      ]
    },

    'as5047p-encoder': {
      title: 'AS5047P 14-Bit High-Precision Magnetic Rotary Encoder Board',
      category: 'Miniature Sensor PCB Design',
      image: 'assets/as5047p-encoder.png?v=2',
      specs: [
        { label: 'Sensor IC', value: 'ams AS5047P 14-Bit Magnetic Rotary Position' },
        { label: 'Digital Interface', value: 'High-Speed SPI Bus + ABI Quadrature + PWM' },
        { label: 'Resolution', value: '14-bit (16,384 positions per revolution)' },
        { label: 'Power Regulation', value: 'Onboard MIC5205-3.3 LDO (12V Robot Bus Direct Input)' },
        { label: 'Form Factor', value: 'Miniaturized Motor-Mountable Footprint' },
        { label: 'EDA Suite', value: 'Altium Designer (2-Layer with Ground Pour)' }
      ],
      description: 'Ultra-compact motor feedback PCB providing high-resolution angular position sensing for closed-loop BLDC/DC motor control in high-speed mobile robotics.',
      challenges: [
        {
          title: 'Power Rail Incompatibility (12V Robot Bus vs. 3.3V Sensor IC)',
          problem: 'Most robot power distribution boards distribute 12V power rails to motor locations, making it difficult to power the 3.3V AS5047P sensor IC without running long, noise-prone dedicated 3.3V lines from the central controller.',
          solution: 'Integrated an onboard wide-input MIC5205-3.3 low-dropout (LDO) regulator directly on the encoder PCB with localized decoupling capacitors, allowing the board to step down the robot\'s existing 12V bus power locally to a clean, stable 3.3V rail right at the sensor.'
        }
      ],
      highlights: [
        '<strong>12V Bus Direct Compatibility:</strong> Solved 3.3V supply challenges by embedding the MIC5205-3.3 LDO, allowing direct connection to the robot\'s standard 12V motor supply without dedicated step-down converters or extra cabling.',
        '<strong>14-bit Spatial Accuracy:</strong> Utilized the AS5047P magnetic Hall sensor delivering 16,384 positions per 360° rotation for smooth torque and velocity control.',
        '<strong>Multi-Protocol Support:</strong> Routed SPI communication lines for absolute position configuration alongside ABI incremental pulses for real-time hardware timers.',
        '<strong>Production Ready:</strong> Full Gerber, NC drill, and 3D STEP files designed for custom 3D-printed and CNC motor end-bell integration.'
      ]
    },

    'localization-pcb': {
      title: 'Robot Localization & Sensor Fusion Board (RBC24/25 LB1.0)',
      category: '2-Layer Sensor Fusion & Coprocessor PCB',
      image: 'assets/robot-localization-pcb.png?v=2',
      specs: [
        { label: 'Board Code', value: 'RNS_2.1.1 (LB1.0)' },
        { label: 'Stackup', value: '2-Layer Optimized Ground Plane & Noise Immunity' },
        { label: 'Input Channels', value: 'Dual Optical Wheel Encoders + SPI 6-DOF IMU' },
        { label: 'Telemetry Stream', value: 'Dual CAN Bus + High-Speed UART (115200+ baud)' },
        { label: 'Function', value: 'Mainboard CPU Offloader & Real-Time Planar Odometry' },
        { label: 'Application', value: 'Autonomous Competition Navigation' }
      ],
      description: 'Dedicated 2-layer sensor aggregation coprocessor PCB engineered to offload the master robotics mainboard by handling high-frequency encoder tick counting and calculating planar robot odometry locally.',
      challenges: [
        {
          title: 'Microcontroller Interrupt Saturation During High-Speed Wheel Rotation',
          problem: 'High-PPR optical encoders generated thousands of hardware interrupt pulses per second, saturating CPU cycles on the primary controller and starving trajectory calculations.',
          solution: 'Architected this dedicated 2-layer coprocessor PCB to relieve CPU and interrupt load on the central mainboard: hardware-captures encoder interrupts, executes real-time odometry sensor fusion locally, and streams aggregated telemetry via CAN frames.'
        }
      ],
      highlights: [
        '<strong>Mainboard CPU Offloading:</strong> Isolates high-frequency encoder hardware interrupts from the central mainboard, preserving master controller processing power for high-level path planning and control loops.',
        '<strong>Deterministic Odometry:</strong> Direct hardware capture of high-PPR wheel encoders combined with SPI IMU rate-gyro reading to calculate instantaneous planar position.',
        '<strong>High-Rate Fieldbus Telemetry:</strong> Packages odometry vectors into CAN frames and UART packets delivered to the primary navigation computer with minimal latency.',
        '<strong>Signal Protection:</strong> 2-layer layout featuring continuous bottom ground return polygons and noise-isolated signal routing to shield high-impedance sensor lines from drivetrain motor EMI.'
      ]
    },

    'power-relay-board': {
      title: '50A / 24V High-Current Motor Relay & Cutoff Module',
      category: 'Power Electronics & Motor Power Management',
      image: 'assets/power_relay_pcb.png',
      specs: [
        { label: 'Continuous Rating', value: '50 Amperes at 24V DC (AZ21501-1CET-24DF Relay)' },
        { label: 'Control Interface', value: '5V Logic Signal (2-Pin XH2.54) with SMD Fuse' },
        { label: 'Galvanic Isolation', value: 'PC817 Optocoupler (Full 5V Logic to 24V Power Domain Isolation)' },
        { label: 'Power Terminals', value: 'High-Current Deans Connectors (Male In / Female Out)' },
        { label: 'Protection', value: 'Fast Flyback Diode (D2) + Littelfuse Input Protection' },
        { label: 'Target Load', value: '5V Controller-Switched High-Torque DC Drive Motors' }
      ],
      description: 'Dedicated high-current relay module engineered to control competition drive motors and safely cut off motor power on demand via a 5V controller signal. Features opto-isolated switching, heavy copper trace pours with solder relief for up to 50A, and robust Deans connectors.',
      challenges: [
        {
          title: 'Safe Motor Power Cutoff & Controller Isolation Under 50A Loads',
          problem: 'Directly switching and cutting off high-draw 24V/50A competition motors from a microcontroller risks back-EMF voltage transients, ground bounce, and catastrophic mainboard damage during emergency stops or motor stalls.',
          solution: 'Architected this 5V signal-controlled relay board utilizing an American Zettler AZ21501 50A power relay and PC817 optocoupler. The 5V controller signal is optically isolated and fuse-protected, driving an NPN coil switch with flyback suppression to safely cut or supply high-current motor power via Deans connectors.'
        }
      ],
      highlights: [
        '<strong>5V Controller-Driven Switching:</strong> Allows any 5V microcontroller GPIO to cleanly control and switch off high-current motors on demand without drawing heavy current from logic rails.',
        '<strong>Galvanic Opto-Isolation:</strong> PC817 optocoupler completely separates the sensitive 5V controller domain from the noisy 24V/50A motor power domain, eliminating ground loops and noise propagation.',
        '<strong>Heavy-Current Geometry & Thermal Relief:</strong> Wide copper pours with exposed solder-mask tinning windows paired with Deans connectors to carry continuous 50A bursts with minimal resistive voltage drop.',
        '<strong>Onboard Visual Diagnostics:</strong> Dual LEDs provide immediate status verification: LED1 confirms 5V control signal reception, while LED2 confirms 24V relay coil activation.'
      ]
    }
  };

  // --- 2. Interactive Filtering & Real-time Search Logic ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('projectSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const searchFeedback = document.getElementById('searchFeedback');
  const emptyState = document.getElementById('projectsEmptyState');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  function applyProjectFilters() {
    let visibleCount = 0;
    const totalCount = projectCards.length;
    const query = currentSearchQuery.trim().toLowerCase();

    projectCards.forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      const title = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.project-desc')?.textContent || '').toLowerCase();
      const tags = (card.querySelector('.project-tags')?.textContent || '').toLowerCase();
      
      const categoryMatch = (currentCategory === 'all' || categories.includes(currentCategory));
      const keywordMatch = !query || title.includes(query) || desc.includes(query) || tags.includes(query);

      if (categoryMatch && keywordMatch) {
        visibleCount++;
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 15);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 150);
      }
    });

    // Update Empty State
    if (emptyState) {
      emptyState.style.display = (visibleCount === 0) ? 'flex' : 'none';
    }

    // Update feedback string
    if (searchFeedback) {
      if (query && currentCategory !== 'all') {
        searchFeedback.textContent = `Found ${visibleCount} project${visibleCount === 1 ? '' : 's'} matching "${query}" in selected category`;
      } else if (query) {
        searchFeedback.textContent = `Found ${visibleCount} project${visibleCount === 1 ? '' : 's'} matching "${query}"`;
      } else if (currentCategory !== 'all') {
        searchFeedback.textContent = `Showing ${visibleCount} of ${totalCount} projects in selected filter`;
      } else {
        searchFeedback.textContent = `Showing all ${totalCount} projects`;
      }
    }

    // Clear button visibility
    if (clearSearchBtn) {
      clearSearchBtn.style.display = query ? 'flex' : 'none';
    }
  }

  // Category Filter Click
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentCategory = button.getAttribute('data-filter') || 'all';
      applyProjectFilters();
    });
  });

  // Search Input Handler (Live Debounced)
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearchQuery = e.target.value;
        applyProjectFilters();
      }, 150);
    });
  }

  // Clear Search Handler
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        currentSearchQuery = '';
        searchInput.focus();
        applyProjectFilters();
      }
    });
  }

  // Reset Filters Handler (from Empty State)
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      currentCategory = 'all';
      currentSearchQuery = '';
      if (searchInput) searchInput.value = '';
      filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'all') {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      applyProjectFilters();
    });
  }

  // --- 3. Technical Modal Deep Dive ---
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalContent = document.getElementById('modalDynamicContent');

  function openProjectModal(projectId) {
    const project = projectDetails[projectId];
    if (!project) return;

    let specsHtml = '';
    project.specs.forEach(s => {
      specsHtml += `
        <div class="modal-spec-item">
          <span class="spec-label">${s.label}</span>
          <span class="spec-val">${s.value}</span>
        </div>
      `;
    });

    let bulletsHtml = '';
    project.highlights.forEach(b => {
      bulletsHtml += `<li>${b}</li>`;
    });

    let challengesHtml = '';
    if (project.challenges && project.challenges.length > 0) {
      challengesHtml += `
        <h4 class="modal-section-h4">// PROBLEMS ENCOUNTERED & ROOT-CAUSE RESOLUTIONS</h4>
        <div class="modal-challenges">
      `;
      project.challenges.forEach(c => {
        challengesHtml += `
          <div class="challenge-card">
            <div class="challenge-header">
              <span class="challenge-title"><i class="fa-solid fa-microchip" style="color: var(--accent-cyan); font-size: 0.9rem;"></i> ${c.title}</span>
            </div>
            <div class="challenge-problem-box">
              <span class="challenge-badge-problem"><i class="fa-solid fa-triangle-exclamation"></i> Identified Problem & Root Cause</span>
              <p class="challenge-problem-text">${c.problem}</p>
            </div>
            <div class="challenge-solution-box">
              <span class="challenge-badge-solution"><i class="fa-solid fa-circle-check"></i> Implemented Engineering Solution & Impact</span>
              <p class="challenge-solution-text">${c.solution}</p>
            </div>
          </div>
        `;
      });
      challengesHtml += `</div>`;
    }

    modalContent.innerHTML = `
      <div class="modal-header-block">
        <span class="modal-category">${project.category}</span>
        <h2 class="modal-title">${project.title}</h2>
      </div>

      ${project.image ? `<img src="${project.image}" alt="${project.title}" class="modal-hero-img">` : `
        <div class="fallback-visual" style="height: 180px; border-radius: var(--radius-md); margin-bottom: 24px; border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0d1525, #111e38);">
          <div class="schematic-preview-art" style="display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--accent-amber);">
            <i class="fa-solid fa-lock" style="font-size: 2.2rem;"></i>
            <span style="font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 1.5px; font-weight: 700;">CONFIDENTIAL // PROPRIETARY HARDWARE</span>
          </div>
        </div>
      `}

      <h4 class="modal-section-h4">// ARCHITECTURE SPECIFICATIONS</h4>
      <div class="modal-spec-grid">
        ${specsHtml}
      </div>

      <h4 class="modal-section-h4">// ENGINEERING OVERVIEW</h4>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; margin-bottom: 20px;">
        ${project.description}
      </p>

      <h4 class="modal-section-h4">// KEY TECHNICAL ACCOMPLISHMENTS</h4>
      <ul class="modal-bullets">
        ${bulletsHtml}
      </ul>

      ${challengesHtml}

      <div style="margin-top: 30px; display: flex; gap: 14px; flex-wrap: wrap;">
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('modalClose').click(); window.location.href='#contact';">
          <i class="fa-solid fa-comments"></i> Discuss This Project
        </button>
        <button class="btn btn-secondary btn-sm" id="modalShareBtn">
          <i class="fa-solid fa-copy"></i> Copy Project Summary
        </button>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Modal Share Button listener
    document.getElementById('modalShareBtn').addEventListener('click', () => {
      const textToCopy = `${project.title} - ${project.description}`;
      copyToClipboard(textToCopy, 'Project summary copied to clipboard!');
    });
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Attach open listeners to all project cards
  projectCards.forEach(card => {
    const projectId = card.getAttribute('data-id');
    const btn = card.querySelector('.open-modal-btn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProjectModal(projectId);
      });
    }
    card.addEventListener('click', () => {
      openProjectModal(projectId);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // --- 4. Toast & Copy to Clipboard ---
  const toast = document.getElementById('toast');
  let toastTimeout;

  function showToast(message) {
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
    }).catch(() => {
      // Fallback
      const tempInput = document.createElement('textarea');
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast(successMsg);
    });
  }

  // Copy email button in hero
  const quickCopyEmail = document.getElementById('quickCopyEmail');
  if (quickCopyEmail) {
    quickCopyEmail.addEventListener('click', () => {
      const email = quickCopyEmail.getAttribute('data-copy');
      copyToClipboard(email, 'Email address copied: ' + email);
    });
  }

  // Generic copy triggers
  const copyTriggers = document.querySelectorAll('.copy-trigger');
  copyTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const data = trigger.getAttribute('data-copy');
      copyToClipboard(data, `Copied: ${data}`);
    });
  });

  // --- 5. Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // --- 6. Interactive Contact Form Submission & Email Draft ---
  const contactForm = document.getElementById('contactForm');
  const contactName = document.getElementById('contactName');
  const contactEmail = document.getElementById('contactEmail');
  const contactCategory = document.getElementById('contactCategory');
  const contactMessage = document.getElementById('contactMessage');
  const formStatus = document.getElementById('formStatus');
  const copyDraftBtn = document.getElementById('copyDraftBtn');

  function getFormattedEmailDraft() {
    const name = (contactName ? contactName.value.trim() : '') || 'Anonymous Recruiter/Partner';
    const email = (contactEmail ? contactEmail.value.trim() : '') || 'No email provided';
    const category = contactCategory ? contactCategory.value : 'General Inquiry';
    const message = (contactMessage ? contactMessage.value.trim() : '') || '(No message content)';

    const subject = `[Portfolio Inquiry] ${category} — from ${name}`;
    const body = `Dear Moaz Hany,\n\n${message}\n\n----------------------------------------\nInquirer: ${name}\nEmail: ${email}\nInquiry Focus: ${category}\nSent via Portfolio Contact Portal`;

    return { name, email, category, message, subject, body };
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal = contactName.value.trim();
      const emailVal = contactEmail.value.trim();
      const msgVal = contactMessage.value.trim();

      if (!nameVal || !emailVal || !msgVal) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please fill in all required fields (Name, Email, and Message).';
        }
        return;
      }

      // Email regex check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        if (formStatus) {
          formStatus.className = 'form-status error';
          formStatus.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please enter a valid email address.';
        }
        return;
      }

      const draft = getFormattedEmailDraft();
      const mailtoUrl = `mailto:moaz.hany.elbakhsha@gmail.com?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;

      if (formStatus) {
        formStatus.className = 'form-status success';
        formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Launching your mail client! If it doesn\'t open automatically, click <strong>"Copy Formatted Draft"</strong> below to send via Gmail or Outlook.';
      }

      // Trigger mail client
      window.location.href = mailtoUrl;
      showToast('Opening default email application...');
    });
  }

  if (copyDraftBtn) {
    copyDraftBtn.addEventListener('click', () => {
      const draft = getFormattedEmailDraft();
      const fullText = `TO: moaz.hany.elbakhsha@gmail.com\nSUBJECT: ${draft.subject}\n\n${draft.body}`;
      copyToClipboard(fullText, 'Inquiry draft copied! Ready to paste into email.');
      if (formStatus) {
        formStatus.className = 'form-status info';
        formStatus.innerHTML = '<i class="fa-solid fa-copy"></i> Complete message copied to clipboard! Paste directly into Gmail, Outlook, or messaging.';
      }
    });
  }

  // --- 7. Scrollspy & Sticky Nav Indicator ---
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  function updateScrollspy() {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateScrollspy, { passive: true });
  updateScrollspy();

  // --- 8. Floating Back to Top Button ---
  const floatingTopBtn = document.getElementById('floatingTopBtn');
  if (floatingTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        floatingTopBtn.classList.add('visible');
      } else {
        floatingTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    floatingTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

});

