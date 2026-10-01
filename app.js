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
        { label: 'Processor', value: 'STM32H7 ARM Cortex-M7 (480 MHz)' },
        { label: 'PCB Stackup', value: '4-Layer High-Density, Solid Ground Planes' },
        { label: 'Fieldbus', value: '3x Hardware-Isolated CAN Buses' },
        { label: 'Power Protection', value: 'TI TPS eFuse + Reverse Polarity Diode' },
        { label: 'Motion & Actuation', value: '6x High-Speed PWM + Dual QEI Quadrature' },
        { label: 'EDA Environment', value: 'Altium Designer (DFM Verified)' }
      ],
      description: 'Designed this 4-layer controller as the central brain for our UTM Robocon competition robots. On our earlier robot, running multi-motor kinematics, sensor reading, and CAN communication on an older STM32F4 caused noticeable control lag and occasional mid-match communication crashes. I redesigned the mainboard around a 480 MHz STM32H7, added a 3rd isolated CAN bus to split high-rate motor commands from sensor traffic, and integrated electronic fuse protection to keep the board safe during motor stalls and testing faults.',
      challenges: [
        {
          title: 'Kinematics Loop Delays on Legacy Microcontroller',
          problem: 'During peak competition maneuvers, our earlier STM32F4 mainboard had to compute inverse kinematics, process encoder interrupts, and service CAN messages concurrently. The compute bottleneck pushed execution cycle times past 15 ms, causing motor command jitter and trajectory tracking errors on the field.',
          solution: 'Redesigned the board around an STM32H7 (ARM Cortex-M7 @ 480 MHz) equipped with double-precision FPU and 32KB cache. Restructured tasks to drop kinematic calculation cycle time down to 1.2 ms (a 92% reduction), delivering deterministic, jitter-free trajectory execution even under full sensor polling loads.'
        },
        {
          title: 'CAN Bus Contention & Bus-Off Lockups',
          problem: 'Telemetry feedback from four high-speed drive motors, encoders, and sensor arrays shared only two CAN channels. Under rapid acceleration bursts, heavy message arbitration caused transmission error counter (TEC) spikes and triggered fatal CAN Bus-Off state transitions that immobilized the robot mid-match.',
          solution: 'Re-architected the fieldbus by integrating a 3rd hardware-isolated CAN transceiver channel with dedicated ground planes and split 120Ω termination. Dedicated CAN1 exclusively to high-rate motor actuation while routing telemetry and sensor packets across CAN2/3, eliminating bus arbitration clashes and achieving zero communication dropouts during tournament play.'
        }
      ],
      highlights: [
        '<strong>480 MHz Processor Upgrade:</strong> Replaced the older STM32F4 with an STM32H7 Cortex-M7 to run robot kinematics and state machines with zero control lag.',
        '<strong>3 Isolated CAN Channels:</strong> Separated motor drive commands from sensor traffic across three independent buses, preventing bus saturation and sudden communication lockups.',
        '<strong>Protected Power Rails:</strong> Integrated Texas Instruments TPS eFuse protection and reverse-polarity circuitry to protect logic components during motor stalls and shorts.',
        '<strong>Dedicated Motion I/O:</strong> Broke out dual Quadrature Encoder Interfaces (QEI) and 6 high-speed PWM channels for direct closed-loop motor control.',
        '<strong>Production-Ready DFM:</strong> Generated full Gerber files, NC drill files, 3D STEP models, and verified BOM in Altium Designer for quick fabrication and assembly.'
      ]
    },

    'greenhouse-robot': {
      title: 'Autonomous Navigation & Control System for Greenhouse Mobile Robot (FYP)',
      category: 'Robotics & Autonomous Systems',
      image: 'assets/capstone_robot/robot_corridor_test.png',
      specs: [
        { label: 'Platform Framework', value: 'ROS2 / Python / C++' },
        { label: 'Sensor Suite', value: '4x Ultrasonic (HC-SR04), 6-DOF IMU (MPU6050), Encoders' },
        { label: 'Control Loop', value: 'Dual-PID Heading & Corridor Centering' },
        { label: 'Low-Level Controller', value: 'Arduino Uno / Mega (PWM & Direction)' },
        { label: 'High-Level Compute', value: 'Onboard Computer running ROS2 Navigation Stack' },
        { label: 'Path Maneuvers', value: 'Crop Row Tracking, 90° Row Transitions, 160° U-Turn' }
      ],
      description: 'Differential-drive mobile robot built for my Final Year Project to navigate agricultural greenhouse aisles autonomously. I used a split control setup: an Arduino handles real-time ultrasonic sensor reading and motor PWM signals, while an onboard computer runs a ROS2 state machine to guide the robot down crop rows, execute turns at aisle ends, and safely reverse out when paths are blocked.',
      challenges: [
        {
          title: 'Odometry Drift & Wheel Slip on Uneven Soil',
          problem: 'Greenhouse furrows feature loose, damp dirt where wheel slip causes cumulative angular error in encoder dead reckoning. Over 15-meter crop corridors, this drift caused the robot to veer off-center into polybags and drip irrigation lines.',
          solution: 'Implemented a sensor-fusion dual-PID controller combining four ultrasonic distance sensors (lateral corridor ranging) with an MPU6050 6-DOF IMU (yaw rate) and wheel encoders. The algorithm dynamically balances lateral wall clearance against heading corrections, maintaining corridor centerline tracking within ±3 cm throughout aisle traversal.'
        }
      ],
      highlights: [
        '<strong>Sensor Fusion for Centering:</strong> Fused 4 ultrasonic distance sensors with an MPU6050 IMU and wheel encoders in a dual-PID loop, keeping the robot centered even when wheels slipped on dirt.',
        '<strong>Navigation State Machine:</strong> Built a ROS2 state machine that detects aisle exits, executes 90-degree turns into adjacent rows, and performs a 160-degree U-turn if the path is blocked.',
        '<strong>Split Compute Architecture:</strong> Offloaded real-time motor control and sensor polling to a dedicated microcontroller, leaving the ROS2 host free for navigation planning via serial communication.',
        '<strong>Obstacle Safety Deceleration:</strong> Set up continuous distance checks that trigger emergency deceleration and recovery backing before the chassis gets close to obstacles.'
      ]
    },

    'greenhouse-vision': {
      title: 'Edge AI Vision & Plant Disease Guidance System for Agricultural Robotics',
      category: 'Computer Vision & Edge AI',
      image: 'assets/capstone_robot/greenhouse_yolo_clear.jpg',
      specs: [
        { label: 'Model Architecture', value: 'YOLOv8 Nano (YOLOv8n)' },
        { label: 'Edge Inference Rate', value: '10 FPS Real-Time on Embedded Hardware' },
        { label: 'Detection Scope', value: '9 Crop Health/Disease Conditions + Polybag Rows' },
        { label: 'Guidance Metrics', value: 'Heading Angle, Corridor Width (m), Obstacles' },
        { label: 'Edge Target Hardware', value: 'Raspberry Pi 3B+ (picamera2 GPU Pipeline)' },
        { label: 'Deployment Status', value: 'Validated on Live Crops in UTM Greenhouse' }
      ],
      description: 'Real-time computer vision system built to guide our greenhouse robot down crop aisles and check plant health. Earlier student teams tried using floor tape and basic color thresholding for navigation, which failed under changing sunlight and messy dirt furrows. I trained a custom YOLOv8 model to detect polybags and foliage instead, turning the crop rows into visual guide rails while simultaneously checking plants for disease symptoms.',
      challenges: [
        {
          title: 'Crop Corridor Tracking Under Fluctuating Natural Illumination',
          problem: 'Greenhouse aisles lack painted navigation lines, and earlier prototypes using floor-tape optical sensors or HSV color thresholding failed due to dirt-covered paths and harsh, moving sunlight shadows across the foliage.',
          solution: 'Shifted to visual feature extraction by training a custom YOLOv8 model to detect crop polybag bases and plant stems in real time. Linear regression fits left and right boundary trajectories from detected bags, calculating real-time corridor center heading (e.g. 92.7°) and navigable path width (0.85m to 1.46m) to steer the robot reliably.'
        },
        {
          title: 'Edge AI Latency Constraints on Embedded Compute',
          problem: 'Standard PyTorch deep learning models overloaded the Raspberry Pi 3B+ CPU, pushing core temperatures into thermal throttling and dropping video processing below 2 FPS—insufficient for closed-loop steering adjustments.',
          solution: 'Optimized the pipeline with a quantized YOLOv8n network, GPU-accelerated video capture via picamera2, and dedicated multi-threaded frame acquisition. Stabilized inference throughput at a consistent 10 FPS with sub-100ms latency, enabling real-time navigation feedback while keeping CPU thermals well within safe operating limits.'
        }
      ],
      highlights: [
        '<strong>10 FPS Edge Inference:</strong> Optimized YOLOv8n with the picamera2 GPU pipeline on a Raspberry Pi 3B+, achieving real-time 10 FPS detection without thermal throttling.',
        '<strong>Natural Crop Row Guidance:</strong> Extracted aisle boundaries directly from detected polybags, calculating real-time corridor width (0.85m – 1.46m) and heading angle to steer between rows.',
        '<strong>Plant Disease Screening:</strong> Trained the model to identify 9 distinct disease symptoms and pest damage types across live chili crops.',
        '<strong>Obstacle Clearance Alerts:</strong> Calculated dynamic steering clearance angles (e.g. 21.5° steer-left alerts) whenever workers, carts, or equipment obstructed the aisle.'
      ]
    },

    'ethernet-can-gateway': {
      title: 'Industrial Ethernet-to-CAN Communication Gateway PCB',
      category: 'High-Speed PCB & Industrial Bus',
      image: 'assets/ethernet-can-gateway.png',
      specs: [
        { label: 'Microcontroller', value: 'STM32F107 (ARM Cortex-M3 with Hardware MAC)' },
        { label: 'Differential Pairs', value: '100Ω Controlled Impedance (ETHER_TX / ETHER_RX)' },
        { label: 'Physical Layer', value: 'Pulse J0011D21B RJ45 (Integrated Magnetics)' },
        { label: 'RMII Bus', value: 'Length-Matched High-Speed Traces' },
        { label: 'CAN Transceivers', value: 'Dual TJA1050 / TCAN334 with 120Ω Split Term.' },
        { label: 'Layers & Stackup', value: '4-Layer Low-EMI Board with Solid Ground Return' }
      ],
      description: 'Designed a 4-layer gateway board to bridge high-speed Ethernet with CAN bus networks. We needed this for our robot telemetry system so high-bandwidth sensor streams could pass between our main navigation computer and distributed motor controllers without packet loss or electrical noise.',
      challenges: [
        {
          title: 'High-Speed Signal Integrity & Ethernet Packet Loss',
          problem: '100BASE-TX differential signals between the PHY and the magnetics RJ45 experienced signal reflections and frame dropouts caused by board trace impedance mismatches and electromagnetic coupling from adjacent DC-DC switching regulators.',
          solution: 'Calculated PCB trace geometry in Altium to enforce strict 100Ω differential impedance on ETHER_TX/RX pairs, matched RMII trace lengths within 50-mil tolerance, and isolated the chassis/magnetics ground plane from digital ground with TVS diode ESD clamps, restoring 100% Ethernet packet throughput.'
        }
      ],
      highlights: [
        '<strong>100Ω Controlled Impedance:</strong> Matched trace geometry to maintain 100-ohm differential impedance on Ethernet lines, stopping reflections and packet dropouts.',
        '<strong>RMII Trace Matching:</strong> Matched trace lengths across high-speed RMII lines between the STM32F107 MCU and the Ethernet PHY to prevent timing skew.',
        '<strong>Dual CAN with Split Termination:</strong> Integrated two independent CAN channels with onboard 120-ohm split termination and TVS diodes for ESD protection.',
        '<strong>Clean Power Planes:</strong> Routed wide 20-30 mil power traces and placed 0603 decoupling capacitors right next to IC power pins over a continuous ground plane.'
      ]
    },

    'vitrox-closed-loop': {
      title: 'Industrial Closed-Loop Illumination & Precision Moving Base (ViE Technologies)',
      category: 'Industrial Automation & QA Systems',
      image: null,
      specs: [
        { label: 'Host Company', value: 'ViE Technologies (Camera Team, Penang)' },
        { label: 'Light Control', value: 'Photodiode Closed-Loop Dynamic PID Feedback' },
        { label: 'Motion Mechanism', value: 'Motorized Precision Moving Base with Encoder Feedback' },
        { label: 'Safety System', value: 'Dual Hardware Limit Switches + Software Travel Bounds' },
        { label: 'Software Stack', value: 'Python Automation GUI + Arduino Firmware' },
        { label: 'QA Target', value: 'X-Ray Protective Glass Light Transmittance Testing' }
      ],
      description: 'Automated test rig I built during my internship on the Camera Team at ViE Technologies. The station evaluates light transmittance through protective glass used on industrial X-ray inspection cameras. I developed both the closed-loop lighting system to keep illumination steady and the motorized positioning stage to hold camera sensors at exact test coordinates.',
      challenges: [
        {
          title: 'Luminous Intensity Drift from Thermal Buildup',
          problem: 'During extended camera QA cycles, inspection light sources experienced non-linear luminous output decay as lamp housings heated up. Because illumination was unstable, camera calibration baselines drifted, requiring technicians to stop testing and manually recalibrate multiple times per shift.',
          solution: 'Engineered an active optical feedback loop using a calibrated photodiode circuit linked to an Arduino and Python PID control service. The system samples live chamber lux and dynamically adjusts the programmable power supply output in real time, stabilizing target illuminance within ±1.5% across full 8-hour production shifts.'
        }
      ],
      highlights: [
        '<strong>Closed-Loop Light Stabilization:</strong> Built a photodiode feedback circuit with PID control to compensate for thermal lamp drift, eliminating repetitive manual recalibrations by technicians.',
        '<strong>Precision Motorized Stage:</strong> Built an encoder-driven motorized moving base with dual limit switches, ensuring cameras returned to the exact same position on every test run.',
        '<strong>Automated X-Ray Glass QA:</strong> Wrote Python automation software that controls the stage motors, powers the lights, takes optical measurements, and logs pass/fail results automatically.',
        '<strong>Floor-Ready Handover:</strong> Prepared complete wiring schematics, component selection documentation, and an easy-to-use Python desktop GUI so production operators could run tests with one click.'
      ]
    },

    'as5047p-encoder': {
      title: 'AS5047P 14-Bit High-Precision Magnetic Rotary Encoder Board',
      category: 'Miniature Sensor PCB Design',
      image: 'assets/as5047p-encoder.png?v=2',
      specs: [
        { label: 'Sensor IC', value: 'ams AS5047P 14-Bit Magnetic Rotary Position Sensor' },
        { label: 'Digital Interfaces', value: 'High-Speed SPI (Absolute Position) + ABI + PWM' },
        { label: 'Resolution', value: '14-Bit (16,384 positions per 360° revolution)' },
        { label: 'Power Input', value: 'Direct 12V Robot Bus via Onboard MIC5205-3.3 LDO' },
        { label: 'Form Factor', value: 'Miniature Circular Board for Motor-Endbell Mounting' },
        { label: 'EDA Suite', value: 'Altium Designer (2-Layer with Solid Copper Pour)' }
      ],
      description: 'Designed a miniature magnetic encoder board to give our robot drive motors precise angular position feedback for closed-loop speed and position control. The challenge on our competition robots was that standard motor bays only provide 12V power; running separate 3.3V lines from the central controller over long wire harnesses picked up heavy electrical noise from the motors.',
      challenges: [
        {
          title: 'Powering a 3.3V Sensor from a 12V Motor Distribution Bus',
          problem: 'Competition robot wire harnesses only distribute 12V power to motor bays. Running separate 3.3V power leads from the central controller across long chassis cable tracks introduced high inductive noise and added wire bundle clutter.',
          solution: 'Integrated an onboard wide-input MIC5205-3.3 low-dropout regulator with localized high-frequency decoupling directly onto the encoder PCB. This enabled the board to tap directly into the adjacent 12V motor supply rail while delivering clean, ripple-free 3.3V power directly to the AS5047P sensor IC.'
        }
      ],
      highlights: [
        '<strong>Direct 12V Bus Operation:</strong> Integrated an onboard MIC5205 LDO directly on the sensor board, eliminating long 3.3V power wires and noise pick-up across the robot chassis.',
        '<strong>14-Bit Angular Precision:</strong> Used the AS5047P Hall-effect sensor to deliver 16,384 counts per revolution, allowing tight velocity control and smooth low-speed motor driving.',
        '<strong>Dual Output Options:</strong> Routed SPI traces to read absolute angles on startup, plus ABI quadrature pulses for direct connection to hardware microcontroller timers.',
        '<strong>Compact Motor-Mount Layout:</strong> Designed the circular 2-layer PCB to fit snugly inside custom 3D-printed end-bells on our drive motors.'
      ]
    },

    'localization-pcb': {
      title: 'Robot Localization & Sensor Fusion Board (RBC24/25 LB1.0)',
      category: '2-Layer Sensor Fusion & Coprocessor PCB',
      image: 'assets/robot-localization-pcb.png?v=2',
      specs: [
        { label: 'Board Identifier', value: 'RNS_2.1.1 (LB1.0)' },
        { label: 'PCB Stackup', value: '2-Layer with Continuous Bottom Ground Return' },
        { label: 'Sensor Inputs', value: 'Dual Optical Wheel Encoders + SPI 6-DOF IMU' },
        { label: 'Communication', value: 'Dual CAN Bus + High-Speed UART (115200+ baud)' },
        { label: 'Primary Function', value: 'Offloads Mainboard Interrupts & Computes Planar Odometry' },
        { label: 'Application', value: 'Competition Robot Dead Reckoning & Navigation' }
      ],
      description: 'Dedicated 2-layer coprocessor board built to handle dead reckoning for our competition robots. High-resolution optical encoders on fast-spinning wheels generate thousands of interrupts every second, which previously overloaded the main controller\'s CPU and caused control loop jitter. This board handles all the pulse counting and heading math locally, then sends clean position coordinates over CAN.',
      challenges: [
        {
          title: 'Main Controller Interrupt Saturation from High-PPR Encoders',
          problem: 'At top wheel velocities, high-resolution optical encoders generated tens of thousands of hardware interrupt pulses per second. Servicing these interrupts on the main controller consumed disproportionate CPU bandwidth, introducing control loop latency in the robot\'s primary motion planner.',
          solution: 'Designed this dedicated 2-layer coprocessor board to hardware-capture encoder timer pulses and read SPI IMU gyro rates independently. The coprocessor calculates real-time planar odometry vectors locally and transmits consolidated position packets over CAN bus at a steady 50 Hz, freeing up master controller CPU cycles for trajectory planning.'
        }
      ],
      highlights: [
        '<strong>Interrupt Offloading:</strong> Moved thousands of encoder pulses per second off the main processor onto a local MCU, freeing up mainboard CPU cycles for navigation logic.',
        '<strong>Onboard Odometry Calculation:</strong> Combines dual optical encoder pulses with SPI IMU rate-gyro data locally to calculate real-time robot position and heading.',
        '<strong>Clean CAN Telemetry:</strong> Packs processed position coordinates into standard CAN frames, sending periodic updates so the rest of the robot has instant dead-reckoning data.',
        '<strong>Noise-Shielded Layout:</strong> Routed signal traces over a solid bottom ground plane and kept encoder inputs filtered to prevent motor switching EMI from causing false counts.'
      ]
    },

    'power-relay-board': {
      title: '50A / 24V High-Current Motor Relay & Cutoff Module',
      category: 'Power Electronics & Motor Power Management',
      image: 'assets/power_relay_pcb.png',
      specs: [
        { label: 'Continuous Rating', value: '50A at 24V DC (AZ21501-1CET-24DF Relay)' },
        { label: 'Control Signal', value: '5V Logic Input (XH2.54 Connector) with Inline Fuse' },
        { label: 'Isolation', value: 'PC817 Optocoupler (Complete Logic-to-Power Isolation)' },
        { label: 'Power Terminals', value: 'High-Current Deans Connectors (Male In / Female Out)' },
        { label: 'Protection', value: 'Fast Flyback Diode (D2) + Littelfuse Overcurrent Fuse' },
        { label: 'Application', value: 'E-Stop and Power Cutoff for High-Torque DC Drive Motors' }
      ],
      description: 'Designed a 50A/24V power relay board to safely switch and cut power to our robot\'s high-power drive motors. During matches or testing, we needed a reliable way for a standard 5V GPIO signal to cut 50A motor power instantly during an emergency stop, without letting inductive voltage spikes back into the main controller.',
      challenges: [
        {
          title: 'High-Current DC Motor Cutoff & Logic Isolation Under 50A Loads',
          problem: 'Switching 24V competition motors under full 50A load generates substantial back-EMF inductive spikes and ground bounce. If shared with logic grounds, emergency motor stops could reset or permanently damage sensitive 3.3V/5V microcontroller boards.',
          solution: 'Designed complete galvanic isolation between logic and power stages using a PC817 optocoupler and an American Zettler AZ21501 50A power relay. The 5V microcontroller signal only triggers the optocoupler LED through an inline SMD fuse, which drives an NPN coil switch protected by a fast flyback diode to safely isolate and cut 50A motor power on command.'
        }
      ],
      highlights: [
        '<strong>Clean 5V Logic Control:</strong> Lets any standard 5V microcontroller GPIO switch or cut high-power 24V motors without pulling current from sensitive logic rails.',
        '<strong>Optocoupler Isolation:</strong> PC817 provides galvanic isolation between logic and power grounds, preventing motor noise and ground bounce from resetting the robot controller.',
        '<strong>50A Copper Pour Layout:</strong> Sized wide copper pours with exposed solder-mask windows for solder tinning, carrying up to 50A with low resistance and heat buildup.',
        '<strong>Visual Status LEDs:</strong> Added two onboard LEDs for quick troubleshooting: LED1 shows the 5V control signal is active, while LED2 verifies the 24V coil has engaged.'
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
        <h4 class="modal-section-h4">Technical Challenges & Engineering Approach</h4>
        <div class="modal-challenges">
      `;
      project.challenges.forEach(c => {
        challengesHtml += `
          <div class="challenge-card">
            <div class="challenge-header">
              <span class="challenge-title"><i class="fa-solid fa-wrench" style="color: var(--accent-cyan); font-size: 0.9rem;"></i> ${c.title}</span>
            </div>
            <div class="challenge-problem-box">
              <span class="challenge-badge-problem"><i class="fa-solid fa-triangle-exclamation"></i> Technical Challenge</span>
              <p class="challenge-problem-text">${c.problem}</p>
            </div>
            <div class="challenge-solution-box">
              <span class="challenge-badge-solution"><i class="fa-solid fa-circle-check"></i> Engineering Approach</span>
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
            <span style="font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 1.5px; font-weight: 700;">CONFIDENTIAL | PROPRIETARY HARDWARE</span>
          </div>
        </div>
      `}

      <h4 class="modal-section-h4">Technical Specifications</h4>
      <div class="modal-spec-grid">
        ${specsHtml}
      </div>

      <h4 class="modal-section-h4">Project Overview</h4>
      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; margin-bottom: 20px;">
        ${project.description}
      </p>

      <h4 class="modal-section-h4">Key Implementation Details</h4>
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

