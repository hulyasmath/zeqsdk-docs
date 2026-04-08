---
sidebar_position: 1
title: Protocols Reference
---

# Protocols Reference

Protocols are the fundamental units of computation in the Zeq API. Each protocol represents a specific algorithm, transformation, or integration capability that the API can perform.

## What Are Protocols?

A protocol defines:
- **What to compute** - The mathematical operation or transformation
- **How to compute it** - The algorithm and approach
- **When to use it** - Domain, use case, and tier requirements
- **Requirements** - Prerequisites, parameters, and constraints

The Zeq SDK exposes **234 protocols** organized into **42 categories**, covering everything from quantum simulations to medical device integrations.

## Protocol Categories

The complete protocol library is organized into these categories:

### Core Computation (6 protocols)
Fundamental computation and phase management operations.
- Basic pulse computation
- Phase locking mechanisms
- Temporal bridging
- Master equation solving
- Verification protocols
- Lattice computations

**Access:** All tiers

---

### Quantum Computing (12 protocols)
Quantum simulation, state manipulation, and measurement.
- Quantum state simulation
- Qubit operations
- Entanglement generation
- Quantum Fourier transform
- Grover's algorithm
- QAOA (Quantum Approximate Optimization Algorithm)
- Variational quantum eigensolver
- Amplitude amplification
- Quantum phase estimation
- Quantum walk algorithms
- Quantum error correction
- Measurement protocols

**Access:** Professional tier

---

### Linear Algebra (8 protocols)
Matrix operations, decompositions, and linear system solving.
- Matrix multiplication
- LU decomposition
- QR decomposition
- Eigenvalue computation
- Singular value decomposition
- Cholesky decomposition
- Gaussian elimination
- Iterative solvers

**Access:** All tiers

---

### Numerical Methods (9 protocols)
Integration, differentiation, interpolation, and approximation.
- Numerical integration (quadrature)
- Numerical differentiation
- Polynomial interpolation
- Spline interpolation
- Root finding (Newton-Raphson)
- Bisection method
- Taylor series approximation
- Padé approximation
- Least squares fitting

**Access:** Standard and Professional tiers

---

### Optimization (7 protocols)
Gradient descent, convex optimization, and constraint solving.
- Gradient descent
- Stochastic gradient descent
- Adam optimizer
- Convex optimization
- Linear programming
- Quadratic programming
- Constrained optimization

**Access:** Professional tier

---

### Machine Learning (11 protocols)
Neural networks, classification, clustering, and inference.
- Dense neural networks
- Convolutional networks
- Recurrent networks
- LSTM networks
- Transformer inference
- k-means clustering
- Random forests
- Support vector machines
- Naive Bayes
- Decision trees
- Kernel methods

**Access:** Professional tier

---

### Signal Processing (10 protocols)
Filtering, transforms, and signal analysis.
- Fast Fourier transform
- Inverse FFT
- Discrete cosine transform
- Wavelet transform
- Hilbert transform
- Butterworth filtering
- Chebyshev filtering
- Window functions
- Spectral analysis
- Adaptive filtering

**Access:** Standard and Professional tiers

---

### Statistical Analysis (8 protocols)
Hypothesis testing, distributions, and statistical inference.
- Probability distributions
- Hypothesis testing (t-test, chi-square, etc.)
- Confidence intervals
- Correlation analysis
- Regression analysis
- Bayesian inference
- Monte Carlo simulation
- Bootstrap sampling

**Access:** Standard and Professional tiers

---

### Cryptography & Security (9 protocols)
Encryption, hashing, key exchange, and zero-knowledge proofs.
- HITE encryption (proprietary)
- TESC transmission protocol (proprietary)
- AES encryption
- RSA key generation
- Diffie-Hellman key exchange
- SHA-256 hashing
- HMAC authentication
- Zero-knowledge proofs
- Certificate generation

**Access:** Professional tier (core); Standard tier (basic)

---

### Graph Algorithms (6 protocols)
Pathfinding, connectivity, and graph analysis.
- Shortest path (Dijkstra)
- All-pairs shortest path (Floyd-Warshall)
- Minimum spanning tree (Kruskal)
- Depth-first search
- Breadth-first search
- Connected components analysis

**Access:** Standard and Professional tiers

---

### Geometry & Spatial (7 protocols)
Computational geometry, spatial indexing, and collision detection.
- Convex hull computation
- Delaunay triangulation
- Voronoi diagram generation
- Point-in-polygon testing
- Spatial indexing (KD-tree)
- Line intersection detection
- Polygon clipping

**Access:** Standard and Professional tiers

---

### String Matching (4 protocols)
Pattern matching, regular expressions, and text analysis.
- Exact string matching
- Approximate string matching (Levenshtein)
- Regular expression matching
- Aho-Corasick multi-pattern matching

**Access:** Standard and Professional tiers

---

### Physics Simulation (8 protocols)
Newtonian mechanics, thermodynamics, and particle systems.
- N-body simulation
- Rigid body dynamics
- Soft body simulation
- Fluid dynamics (incompressible)
- Thermal diffusion
- Particle collision detection
- Spring-mass systems
- Constraint-based dynamics

**Access:** Professional tier

---

### Medical Imaging (10 protocols)
MRI, CT, ultrasound, X-ray, and PET integration.
- MRI image processing and reconstruction
- CT scan reconstruction
- Ultrasound image enhancement
- X-ray analysis
- PET image reconstruction
- Multi-modality fusion
- 3D volume rendering
- Segmentation algorithms
- Registration algorithms
- Artifact removal

**Access:** Medical tier

---

### Medical Devices (10 protocols)
Integration with medical equipment and monitoring systems.
- Dialysis machine control
- Ventilator automation
- Pacemaker communication
- Insulin pump integration
- Electrophysiology system interface
- Cardiac monitoring
- Vital signs aggregation
- Device synchronization
- Data logging and audit
- Safety protocols

**Access:** Medical tier (emergency available)

---

### Emergency Response (5 protocols)
911 coordination, triage, and disaster management.
- 911 alert filing
- Medical triage protocols
- Ambulance dispatch coordination
- Disaster response coordination
- Search and rescue operations

**Access:** Emergency tier

---

### Gaming Physics (5 protocols)
Game engine integration and real-time physics.
- Real-time rigid body physics
- Character controller implementation
- Ragdoll dynamics
- Water and cloth simulation
- Destruction physics

**Access:** Professional tier

---

### Procedural Generation (4 protocols)
Noise, terrain, and content generation.
- Perlin noise generation
- Simplex noise
- Procedural terrain generation
- Dungeon generation algorithms

**Access:** Professional tier

---

### Networking & Netcode (6 protocols)
Multiplayer game synchronization and networking.
- Authoritative server simulation
- Client prediction
- Lag compensation
- Bandwidth optimization
- Jitter buffer management
- State synchronization

**Access:** Professional tier

---

### Game AI (5 protocols)
Pathfinding, behavior trees, and opponent AI.
- Hierarchical pathfinding
- Behavior tree execution
- Decision making
- Flocking algorithms
- Crowd simulation

**Access:** Professional tier

---

### Spatial Audio (4 protocols)
3D audio processing and spatialization.
- HRTF (Head-Related Transfer Function) processing
- Binaural rendering
- Ambisonics encoding/decoding
- Room acoustics simulation

**Access:** Professional tier

---

### Blockchain & Ledger (5 protocols)
Distributed ledger operations and consensus.
- Merkle tree operations
- Proof of work generation
- UTXO management
- Smart contract execution
- Transaction validation

**Access:** Professional tier

---

### Data Compression (6 protocols)
Lossless and lossy compression algorithms.
- LZ77 compression
- Huffman coding
- DEFLATE compression
- Run-length encoding
- JPEG compression
- PNG compression

**Access:** Standard and Professional tiers

---

## Accessing Protocol Documentation

Each category has a dedicated documentation page with:
- **Overview** - What the protocols do and when to use them
- **Full protocol list** - Complete details for each protocol
- **Parameters** - Required and optional inputs
- **Examples** - Real-world usage examples
- **Tier requirements** - Which subscription levels have access

**View by Category:** Select a category below to see all protocols in that category.

## Protocol Totals

- **Total Protocols:** 234
- **Total Categories:** 42
- **Free Tier Access:** 15 categories (58 protocols)
- **Standard Tier Access:** 28 categories (142 protocols)
- **Professional Tier Access:** 38 categories (224 protocols)
- **Medical Tier Access:** 10 categories (50 protocols)
- **Emergency Tier Access:** 5 categories (25 protocols)

## Protocol Naming Convention

Protocol IDs follow this pattern: `PROTOCOL_DESCRIPTIVE_NAME`

Examples:
- `PROTOCOL_QUANTUM_STATE_SIMULATION`
- `PROTOCOL_FFT`
- `PROTOCOL_MRI_RECONSTRUCTION`
- `PROTOCOL_NEURAL_NETWORK_DENSE`

## Tier Requirements

Different subscription tiers unlock access to different protocols:

| Tier | Protocols | Features |
|------|-----------|----------|
| **Free** | 58 | Basic computation, linear algebra, some numerical methods |
| **Standard** | 142 | All free, plus signal processing, statistics, graph algorithms |
| **Professional** | 224 | All standard, plus quantum, ML, optimization, physics |
| **Medical** | 50 (specialized) | Medical imaging, medical device integration |
| **Emergency** | 25 (specialized) | Emergency services and disaster response |

## Searching for Protocols

Use the sidebar to browse by category, or search across all protocols:

- **By use case:** Look under Physics Simulation for game physics
- **By domain:** Machine Learning category for neural networks
- **By algorithm:** Search "FFT" to find signal processing
- **By integration:** Medical category for device support

## Common Protocol Paths

**For Game Development:**
1. Gaming Physics (rigid body, collision)
2. Procedural Generation (terrain, dungeons)
3. Game AI (pathfinding, behavior)
4. Networking & Netcode (multiplayer sync)
5. Spatial Audio (3D sound)

**For Machine Learning:**
1. Numerical Methods (optimization)
2. Machine Learning (networks, inference)
3. Signal Processing (feature extraction)
4. Statistical Analysis (validation)

**For Medical Applications:**
1. Medical Imaging (image processing)
2. Medical Devices (equipment integration)
3. Statistical Analysis (outcome tracking)
4. Emergency Response (triage, coordination)

---

## Generated Protocol Pages

The following category pages are auto-generated from the protocol registry. Each contains:
- Detailed protocol specifications
- Parameter tables
- curl examples for each protocol
- Rate limiting and authentication details
- Tier-specific access notes

**Category pages are generated dynamically.** Run `npm run build:protocols` in the docs directory to regenerate them.

## Adding New Protocols

New protocols are added to the Zeq API regularly. To stay updated:

1. **Subscribe to updates:** https://zeq.io/updates
2. **Check the changelog:** https://docs.zeq.io/changelog
3. **Follow the blog:** https://zeq.io/blog
4. **API version header:** Check `X-API-Version` in response headers

## Feedback & Requests

Have a protocol idea or need a specific algorithm?

- **Feature requests:** https://feedback.zeq.io
- **Community forum:** https://community.zeq.io
- **Email:** support@zeq.io
