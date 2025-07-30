<template>
  <div class="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 transition-all duration-500">
    <!-- Enhanced Background -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.4),transparent_50%)]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.3),transparent_50%)]"></div>
      <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
    </div>

    <!-- Main Container -->
    <div class="relative z-10 max-w-5xl w-full">
      <!-- Enhanced Error Card -->
      <div class="bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
        
        <!-- Header Section -->
        <div class="relative bg-gradient-to-r from-red-500/30 via-pink-500/30 to-purple-600/30 p-8 text-center overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-red-400/20 to-purple-600/20 animate-pulse"></div>
          
          <!-- Enhanced Error Code -->
          <div class="relative mb-6">
            <div class="text-8xl md:text-9xl font-black bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse drop-shadow-2xl">
              {{ errorCode }}
            </div>
            <div class="absolute inset-0 text-8xl md:text-9xl font-black bg-gradient-to-br from-red-400 via-pink-500 to-purple-600 bg-clip-text text-transparent opacity-50 blur-lg animate-pulse"></div>
          </div>

          <!-- Enhanced Title -->
          <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            {{ title }}
          </h1>

          <!-- Enhanced Message -->
          <p class="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            {{ message }}
          </p>
        </div>

        <!-- Enhanced Game Container -->
        <div class="p-8 bg-gradient-to-b from-transparent to-white/5">
          <!-- Enhanced Game Selection -->
          <div class="flex justify-center mb-8">
            <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-3 flex gap-3 flex-wrap border border-white/20">
              <button 
                @click="currentGame = 'snake'"
                :class="[
                  'px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105',
                  currentGame === 'snake' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50' 
                    : 'bg-white/10 hover:bg-white/20 text-white hover:shadow-lg'
                ]"
              >
                🐍 Snake Pro
              </button>
              <button 
                @click="currentGame = 'memory'"
                :class="[
                  'px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105',
                  currentGame === 'memory' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/50' 
                    : 'bg-white/10 hover:bg-white/20 text-white hover:shadow-lg'
                ]"
              >
                🧠 Xotira Plus
              </button>
              <button 
                @click="currentGame = 'clicker'"
                :class="[
                  'px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105',
                  currentGame === 'clicker' 
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/50' 
                    : 'bg-white/10 hover:bg-white/20 text-white hover:shadow-lg'
                ]"
              >
                🎯 Target Master
              </button>
            </div>
          </div>

          <!-- Enhanced Snake Game -->
          <div v-if="currentGame === 'snake'" class="game-container">
            <div class="flex justify-between items-center mb-6">
              <div class="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                Ball: {{ snake.score }}
              </div>
              <div class="text-sm text-slate-300 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                WASD yoki o'q tugmalari
              </div>
            </div>
            
            <div class="bg-black/40 backdrop-blur-sm rounded-2xl p-6 mx-auto border border-white/30 shadow-2xl max-w-md">
              <div class="grid grid-cols-15 gap-1">
                <div 
                  v-for="(cell, index) in snakeGrid" 
                  :key="index"
                  :class="[
                    'w-6 h-6 rounded-md transition-all duration-200',
                    cell === 'snake-head' 
                      ? 'bg-gradient-to-r from-green-400 to-green-600 shadow-lg shadow-green-500/50 animate-pulse' 
                      : cell === 'snake-body' 
                      ? 'bg-gradient-to-r from-green-500 to-green-700 shadow-md' 
                      : cell === 'food' 
                      ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full animate-bounce shadow-lg shadow-orange-500/50' 
                      : 'bg-white/10 hover:bg-white/20'
                  ]"
                ></div>
              </div>
            </div>
            
            <div class="text-center mt-6">
              <button 
                @click="startSnake"
                :disabled="snake.gameRunning"
                class="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ snake.gameRunning ? "O'yin davom etmoqda..." : "🎮 Boshlash" }}
              </button>
            </div>
          </div>

          <!-- Enhanced Memory Game -->
          <div v-if="currentGame === 'memory'" class="game-container">
            <div class="flex justify-between items-center mb-6">
              <div class="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
                Ball: {{ memory.score }}
              </div>
              <div class="text-sm text-slate-300 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                Harakatlar: {{ memory.moves }}
              </div>
            </div>
            
            <div class="grid grid-cols-4 gap-4 max-w-md mx-auto">
              <div 
                v-for="(card, index) in memory.cards" 
                :key="index"
                @click="flipCard(index)"
                :class="[
                  'h-20 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl cursor-pointer transition-all duration-500 hover:bg-white/20 border border-white/20 shadow-lg transform hover:scale-105',
                  (card.flipped || card.matched || memory.showCards) ? 'bg-blue-500/30 scale-105 shadow-blue-500/50' : 'hover:shadow-xl',
                  card.matched ? 'bg-green-500/30 shadow-green-500/50' : ''
                ]"
              >
                {{ (card.flipped || card.matched || memory.showCards) ? card.emoji : '❓' }}
              </div>
            </div>
            
            <div class="text-center mt-6">
              <button 
                @click="startMemory"
                :disabled="memory.gameRunning"
                class="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ memory.gameRunning ? "O'yin davom etmoqda..." : "🧠 Boshlash" }}
              </button>
            </div>
          </div>

          <!-- Enhanced Clicker Game -->
          <div v-if="currentGame === 'clicker'" class="game-container">
            <div class="text-center mb-6">
              <div class="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent mb-2">
                Ball: {{ clicker.score }}
              </div>
              <div class="text-sm text-slate-300 mb-4">
                Combo: x{{ clicker.combo }}
              </div>
              <div class="text-2xl font-bold mb-4">
                Vaqt: <span class="text-red-400">{{ clicker.timeLeft }}</span>s
              </div>
            </div>
            
            <div class="relative h-64 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
              <button 
                @click="clickTarget"
                :disabled="!clicker.gameRunning"
                :style="{
                  position: 'absolute',
                  left: clicker.targetPosition.x + '%',
                  top: clicker.targetPosition.y + '%',
                  transform: 'translate(-50%, -50%)'
                }"
                :class="[
                  'w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full text-2xl transition-all duration-300 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-500/70 transform hover:scale-110 active:scale-95',
                  clicker.clickAnimation ? 'animate-ping' : '',
                  clicker.gameRunning ? 'cursor-pointer animate-pulse' : 'opacity-50 cursor-not-allowed'
                ]"
              >
                🎯
              </button>
            </div>
            
            <div class="text-center mt-6">
              <button 
                @click="startClicker"
                :disabled="clicker.gameRunning"
                class="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ clicker.gameRunning ? "O'yin davom etmoqda..." : "🎯 Boshlash" }}
              </button>
            </div>
          </div>
        </div>

        <!-- Enhanced Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center p-8 pt-0">
          <router-link to="/" class="group">
            <button class="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <span class="relative z-10 flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span>Asosiy sahifaga qaytish</span>
              </span>
            </button>
          </router-link>

          <button 
            @click="refreshPage"
            class="w-full sm:w-auto relative overflow-hidden bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm shadow-lg hover:shadow-xl"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Sahifani yangilash</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPageWithGames',
  props: {
    errorCode: {
      type: Number,
      default: 404
    }
  },
  data() {
    return {
      currentGame: 'snake',
      
      // Snake Game
      snake: {
        snake: [{x: 7, y: 7}],
        food: {x: 5, y: 5},
        direction: {x: 1, y: 0},
        score: 0,
        gameLoop: null,
        gameRunning: false,
        speed: 300
      },
      
      // Memory Game
      memory: {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        score: 0,
        gameRunning: false,
        moves: 0,
        showCards: false
      },
      
      // Clicker Game
      clicker: {
        score: 0,
        timeLeft: 15,
        gameRunning: false,
        timer: null,
        clickAnimation: false,
        combo: 0,
        targetPosition: { x: 50, y: 50 }
      }
    }
  },
  computed: {
    title() {
      const titles = {
        404: "Sahifa topilmadi",
        500: "Server xatosi",
        403: "Ruxsat berilmagan",
        400: "Noto'g'ri so'rov",
        401: "Autentifikatsiya talab qilinadi",
        502: "Gateway xatosi",
        503: "Xizmat mavjud emas"
      };
      return titles[this.errorCode] || "Noma'lum xato";
    },
    message() {
      const messages = {
        404: "Siz qidirgan sahifa mavjud emas. Kutayotgan vaqtda premium o'yinlar o'ynaymizmi?",
        500: "Server xatosi yuz berdi. Vaqtingizni mukammal o'yinlar bilan o'tkazing!",
        403: "Bu sahifaga kirish uchun ruxsatingiz yo'q. O'yin o'ynab vaqt o'tkazing.",
        400: "So'rovingiz noto'g'ri. O'yinlar bilan dam oling!",
        401: "Tizimga kirishingiz kerak. O'yin o'ynab kutib turing.",
        502: "Gateway xatosi. O'yinlar bilan vaqt o'tkazing.",
        503: "Xizmat vaqtincha mavjud emas. O'yinlar bilan zerikmaslik!"
      };
      return messages[this.errorCode] || "Noma'lum xato. Premium o'yinlar bilan vaqt o'tkazing!";
    },
    snakeGrid() {
      const grid = new Array(225).fill('empty');
      
      // Snake segments
      this.snake.snake.forEach((segment, index) => {
        const cellIndex = segment.y * 15 + segment.x;
        if (cellIndex >= 0 && cellIndex < 225) {
          grid[cellIndex] = index === 0 ? 'snake-head' : 'snake-body';
        }
      });
      
      // Food
      const foodIndex = this.snake.food.y * 15 + this.snake.food.x;
      if (foodIndex >= 0 && foodIndex < 225) {
        grid[foodIndex] = 'food';
      }
      
      return grid;
    }
  },
  methods: {
    // Snake Game Methods
    startSnake() {
      if (this.snake.gameRunning) return;
      
      this.snake.snake = [{x: 7, y: 7}];
      this.snake.direction = {x: 1, y: 0};
      this.snake.score = 0;
      this.snake.gameRunning = true;
      this.snake.speed = 300;
      
      this.generateFood();
      this.snake.gameLoop = setInterval(this.moveSnake, this.snake.speed);
    },
    
    moveSnake() {
      const head = { ...this.snake.snake[0] };
      head.x += this.snake.direction.x;
      head.y += this.snake.direction.y;
      
      // Check boundaries
      if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15) {
        this.gameOver('snake');
        return;
      }
      
      // Check self collision
      if (this.snake.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        this.gameOver('snake');
        return;
      }
      
      this.snake.snake.unshift(head);
      
      // Check food collision
      if (head.x === this.snake.food.x && head.y === this.snake.food.y) {
        this.snake.score += 10;
        this.generateFood();
        
        // Increase speed
        this.snake.speed = Math.max(150, this.snake.speed - 5);
        clearInterval(this.snake.gameLoop);
        this.snake.gameLoop = setInterval(this.moveSnake, this.snake.speed);
      } else {
        this.snake.snake.pop();
      }
    },
    
    generateFood() {
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * 15),
          y: Math.floor(Math.random() * 15)
        };
      } while (this.snake.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
      
      this.snake.food = newFood;
    },
    
    // Memory Game Methods
    startMemory() {
      if (this.memory.gameRunning) return;
      
      this.memory.score = 0;
      this.memory.matchedPairs = 0;
      this.memory.flippedCards = [];
      this.memory.gameRunning = true;
      this.memory.moves = 0;
      this.memory.showCards = true;
      
      this.initMemoryCards();
      
      // Show all cards for 2 seconds
      setTimeout(() => {
        this.memory.showCards = false;
      }, 2000);
    },
    
    initMemoryCards() {
      const emojis = ['🎮', '🎯', '🎲', '🃏', '🎪', '🎨', '🎭', '⚽'];
      const gameEmojis = [...emojis, ...emojis];
      const shuffled = gameEmojis.sort(() => Math.random() - 0.5);
      
      this.memory.cards = shuffled.map(emoji => ({
        emoji,
        flipped: false,
        matched: false
      }));
    },
    
    flipCard(index) {
      if (!this.memory.gameRunning || this.memory.showCards) return;
      if (this.memory.flippedCards.length >= 2) return;
      if (this.memory.cards[index].flipped || this.memory.cards[index].matched) return;
      
      this.memory.cards[index].flipped = true;
      this.memory.flippedCards.push(index);
      this.memory.moves++;
      
      if (this.memory.flippedCards.length === 2) {
        setTimeout(this.checkMatch, 1000);
      }
    },
    
    checkMatch() {
      const [first, second] = this.memory.flippedCards;
      const firstCard = this.memory.cards[first];
      const secondCard = this.memory.cards[second];
      
      if (firstCard.emoji === secondCard.emoji) {
        firstCard.matched = true;
        secondCard.matched = true;
        this.memory.matchedPairs++;
        this.memory.score += Math.max(5, 20 - Math.floor(this.memory.moves / 2));
        
        if (this.memory.matchedPairs === 8) {
          this.gameOver('memory');
        }
      } else {
        firstCard.flipped = false;
        secondCard.flipped = false;
      }
      
      this.memory.flippedCards = [];
    },
    
    // Clicker Game Methods
    moveTarget() {
      return {
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70
      };
    },
    
    startClicker() {
      if (this.clicker.gameRunning) return;
      
      this.clicker.score = 0;
      this.clicker.timeLeft = 15;
      this.clicker.gameRunning = true;
      this.clicker.combo = 0;
      this.clicker.targetPosition = this.moveTarget();
      
      this.clicker.timer = setInterval(() => {
        this.clicker.timeLeft--;
        if (this.clicker.timeLeft <= 0) {
          this.gameOver('clicker');
        } else {
          // Move target every second
          this.clicker.targetPosition = this.moveTarget();
        }
      }, 1000);
    },
    
    clickTarget() {
      if (!this.clicker.gameRunning) return;
      
      this.clicker.combo++;
      const bonusPoints = Math.floor(this.clicker.combo / 5);
      this.clicker.score += 1 + bonusPoints;
      this.clicker.clickAnimation = true;
      this.clicker.targetPosition = this.moveTarget();
      
      setTimeout(() => {
        this.clicker.clickAnimation = false;
      }, 200);
    },
    
    // Game Over
    gameOver(gameType) {
      if (gameType === 'snake') {
        clearInterval(this.snake.gameLoop);
        this.snake.gameRunning = false;
        this.$nextTick(() => {
          alert(`O'yin tugadi! Ball: ${this.snake.score}`);
        });
      } else if (gameType === 'memory') {
        this.memory.gameRunning = false;
        this.$nextTick(() => {
          alert(`Tabriklaymiz! Ball: ${this.memory.score}, Harakatlar: ${this.memory.moves}`);
        });
      } else if (gameType === 'clicker') {
        clearInterval(this.clicker.timer);
        this.clicker.gameRunning = false;
        this.$nextTick(() => {
          alert(`Vaqt tugadi! Ball: ${this.clicker.score}, Combo: ${this.clicker.combo}`);
        });
      }
    },
    
    // Keyboard handler
    handleKeydown(e) {
      if (this.currentGame !== 'snake' || !this.snake.gameRunning) return;
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (this.snake.direction.y === 0) {
            this.snake.direction = {x: 0, y: -1};
          }
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (this.snake.direction.y === 0) {
            this.snake.direction = {x: 0, y: 1};
          }
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (this.snake.direction.x === 0) {
            this.snake.direction = {x: -1, y: 0};
          }
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (this.snake.direction.x === 0) {
            this.snake.direction = {x: 1, y: 0};
          }
          break;
      }
    },
    
    refreshPage() {
      window.location.reload();
    }
  },
  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    if (this.snake.gameLoop) clearInterval(this.snake.gameLoop);
    if (this.clicker.timer) clearInterval(this.clicker.timer);
  }
}
</script>

<style scoped>
/* Custom Grid */
.grid-cols-15 {
  display: grid;
  grid-template-columns: repeat(15, minmax(0, 1fr));
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoomIn {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}

.animate-in {
  animation: fadeIn 0.5s ease-out;
}

.fade-in-0 {
  animation: fadeIn 0.5s ease-out;
}

.zoom-in-95 {
  animation: zoomIn 0.5s ease-out;
}

.delay-1000 {
  animation-delay: 1s;
}

.delay-2000 {
  animation-delay: 2s;
}
*{
  color: white;
}

/* Hover effects */
.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
}

/* Enhanced transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-500 {
  transition-duration: 500ms;
}

/* Backdrop blur */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

.backdrop-blur-3xl {
  backdrop-filter: blur(64px);
}

/* Text gradients */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

.text-transparent {
  color: transparent;
}

/* Enhanced shadows */
.shadow-green-500\/50 {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
}

.shadow-blue-500\/50 {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}
</style>