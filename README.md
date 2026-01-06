# Odin Battleship

A fully dynamic, interactive Battleship game built as part of **The Odin Project** curriculum.  
This project emphasizes **Test-Driven Development (TDD)**, **modular architecture**, **AI opponent logic**, and **clean separation of concerns** between game logic and presentation.

The game is built from the ground up using **vanilla JavaScript** with comprehensive **Jest test coverage**, demonstrating solid software engineering practices including unit testing, integration testing, and the usage of OOP principles.

---

## 🧩 Project Description

This Battleship implementation allows users to:

- Play against an intelligent computer opponent
- Place ships on a customizable grid (5×5 to 10×10)
- Attack opponent's board with real-time feedback
- Track hits, misses, and sunken ships
- Enjoy smooth turn-based gameplay with visual feedback
- Experience a fully tested codebase with 95%+ test coverage
- Start new games at any time with proper cleanup

The codebase follows **MVC principles** with Models handling game logic, Views managing the DOM, and Controllers coordinating between them.

---

## 🚀 Features

### 🛠 Modern Development Practices

- **Test-Driven Development** with comprehensive Jest test suites
- **Webpack bundling** for JavaScript, CSS, and assets
- Full **ES6+ module syntax** with private class fields
- **Shared constants** for maintainable configuration
- Clean separation of concerns across architectural layers
- Proper async handling and game state management

### 🎮 Gameplay Features

- **Smart AI opponent** with random and hunt-and-target attack strategies (extensible for future AI strategies)
- **Configurable board sizes** (5×5 to 10×10) with balanced ship configurations
- **Real-time attack feedback** (hit, miss, sunk, game over)
- **Visual state indicators** for ship placement and attacks
- **Turn-based gameplay** with message notifications
- **No duplicate attacks** - intelligent attack history tracking
- **Graceful game resets** with proper cleanup of pending operations

### 🧪 Testing & Quality

- Comprehensive unit tests for all game models
- Integration tests for player interactions
- Edge case coverage (boundary conditions, invalid inputs)
- Test-driven bug fixes with regression prevention
- Validated ship placement logic and attack mechanics

---

## 🧠 Application Architecture (MVC)

### **Model Layer**

- `Ship.js` - Individual ship with hit tracking and sunk status
- `Gameboard.js` - Grid management, ship placement, attack handling
- `Player.js` - Base player class with `RealPlayer` and `ComputerPlayer` subclasses
- `Constants.js` - Centralized configuration (board sizes, ship lengths, directions)

**Responsibilities:**

- Game state management
- Rule enforcement and validation
- Attack logic and win condition detection
- AI strategy implementation

### **View Layer**

- `GameView.js` - Renders game boards, ships, and attack results
- `DialogView.js` - Handles new game dialog opening, submission, and closing
- DOM manipulation and event binding only - **no game logic**

**Responsibilities:**

- Rendering game state to the DOM
- Handling user interactions and forwarding to controller
- Visual feedback (messages, state changes)

### **Controller Layer**

- `controller.js` - Orchestrates gameplay flow and turn management, handles game initialization

**Responsibilities:**

- Coordinating between models and views
- Managing game lifecycle (start, turns, end, reset)
- Handling async operations and timeouts
- Preventing race conditions with game ID tracking

### **Utilities**

- `gameSetup.js` - Random ship placement with retry logic and board validation
- Exported helper functions for ship placement algorithms
- `UIUtils.js` - Helper functions for DOM manipulation

---

## 🎯 Core Algorithms

### Random Ship Placement

```javascript
// Guarantees valid ship placement with configurable retry limits
tryPlaceShip(board, length, maxAttempts);
placeShipsRandom(boards, shipLengths);
```

- Validates board capacity before attempting placement
- Uses retry logic with configurable max attempts (default: 1000)
- Ensures no overlapping ships or out-of-bounds placement
- Supports multiple boards for simultaneous setup

### AI Attack Strategy

Current implementation uses random attacks with duplicate prevention:

- Tracks all previous attacks in a Set
- Generates coordinates until an unattacked cell is found
- Extensible architecture for future smart AI strategies

A hunt-and-target mode is also available when creating a new game:

- Hunt mode: Semi-random attacks until a hit is found
- Target mode: Attack adjacent cells around known hits

**Planned AI improvements:**

- Improve the targeting mode to work out the direction of a ship and only follow this direction until the ship is sunk
- Smart mode: Probability-based targeting considering remaining ship sizes

---

## 📁 Folder Structure

```
src/
├── __tests__/
│   ├── gameboard.test.js
│   ├── gameSetup.test.js
│   ├── player.test.js
│   └── ship.test.js
│
├── models/
│   ├── Constants.js
│   ├── Gameboard.js
│   ├── Player.js
│   └── Ship.js
│
├── styles/
│   ├── base.css
│   ├── components.css
│   ├── layout.css
│   ├── tokens.css
│   └── utilities.css
│
├── utils/
│   ├── gameSetup.js
│   └── UIUtils.js
│
├── views/
│   ├── DialogView.js
│   └── GameView.js
│
├── controller.js
├── index.html
└── index.js
```

---

## 🧪 Test Coverage

Comprehensive Jest test suites covering:

**Ship Tests:**

- Constructor validation (length ranges, type checking)
- Hit tracking and sunk detection
- Edge cases (over-hitting, boundary conditions)

**Gameboard Tests:**

- Board creation and sizing
- Ship placement in all directions
- Overlap and boundary validation
- Attack mechanics (hit, miss, sunk, sunk-all)
- Duplicate attack prevention

**Player Tests:**

- RealPlayer manual coordinate attacks
- ComputerPlayer automatic attack generation
- Attack history tracking
- Full game simulation (play until victory)

**Game Setup Tests:**

- Random direction generation
- Ship placement with retry logic
- Board capacity validation
- Multi-board setup
- Edge cases (full boards, impossible placements)

---

## 🎯 Learning Objectives

This project was built to develop practical experience with:

- **Test-Driven Development** - Writing tests before implementation
- **Object-Oriented Programming** - Classes, inheritance, encapsulation, private fields
- **Factory Pattern** - Creating game objects with flexible configurations
- **MVC Architecture** - Separating concerns across models, views, and controllers
- **ES6+ Features** - Modules, async/await, Set/Map, destructuring, private fields (`#`)
- **Game AI** - Implementing computer opponents with strategic decision-making
- **Webpack Configuration** - Building modern JavaScript applications
- **Async Programming** - Managing timeouts, delays, and preventing race conditions
- **State Management** - Tracking game state and preventing invalid transitions
- **Error Handling** - Graceful failure with descriptive error messages

This is my **first time building a game with comprehensive test coverage and proper architecture**, significantly improving my ability to write maintainable, testable code.

---

## 🌐 Live Demo

[Odin Battleship Live Demo](https://jameslafontaine.github.io/odin-battleship/)

---

## 🔮 Future Improvements

### Gameplay Enhancements

- **Sound effects** for attacks, hits, and ship destruction
- **Game event log** showing full attack history
- **Grid coordinates** (A-J, 1-10) for easier reference
- **Improved AI strategies**:
    - Smart mode (probability-based targeting)
    - Multiple difficulty levels

### UI/UX Improvements

- **Drag-and-drop ship placement** for more intuitive setup
- **Higher quality graphics and animations**
    - Water effects and explosions
    - Ship sinking animations
    - Victory/defeat screens
- **Optimized rendering** - cache and update only changed cells instead of full re-render
- **Responsive design** for mobile and tablet gameplay
- **Keyboard navigation** for accessibility

### Multiplayer & Social

- **Two-player local mode** (hot-seat multiplayer):
    - "Pass device" screen to hide boards between turns
    - Turn timers to prevent peeking
- **Online multiplayer** with WebSockets or Firebase
- **Replay system** to review past games
- **Statistics tracking** (win/loss ratio, average turns to win)

### Advanced Features

- **Custom ship configurations** - let players choose ship sizes
- **Multiple game modes**:
    - Salvo mode (multiple shots per turn)
    - Mines and special weapons
    - Fog of war with partial visibility
- **Save/load games** with localStorage persistence
- **Spectator mode** for watching AI vs AI battles
- **Tournament bracket system** for multiple games

---

## 🛠 Installation & Development

```bash
# Clone the repository
git clone https://github.com/yourusername/odin-battleship.git

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build
```

---

## 📜 License

This project is for educational purposes and follows **The Odin Project** curriculum guidelines.  
Feel free to fork, modify, and explore.

---

## 🙏 Acknowledgments

Built as part of [The Odin Project](https://www.theodinproject.com/) curriculum.  
Special thanks to the TOP community for guidance and support.
