var TILE_WIDTH = 101;
var TILE_HEIGHT = 83;
var allEnemies;
var player;
var items;
var gemstone;

var GameItem = function (image, x, y) {
    this.x = (x - 1) * TILE_WIDTH;
    this.y = (y - 1) * TILE_HEIGHT;
    this.sprite = image;
};

GameItem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

GameItem.prototype.update = function (dt) {

};

GameItem.prototype.checkCollisions = function (other) {
    var distance = Math.sqrt(Math.pow(this.x - other.x, 2) +
        Math.pow(this.y - other.y, 2));
    if (distance < 50) {
        throw "Collision";
    }
};

var Gemstone = function (x, y) {
    GameItem.call(this, 'images/Gem-Orange.png', x, y);
    this.alpha = 0;
    this.alphaDelta = 1;
};

Gemstone.prototype = Object.create(GameItem.prototype);

Gemstone.prototype.render = function () {
    ctx.globalAlpha = this.alpha;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.globalAlpha = 1;
};

Gemstone.prototype.update = function (dt) {
    //Fade gemstone in and out. 
    this.alpha = this.alpha + this.alphaDelta * dt;
    if (this.alpha > 1) {
        this.alphaDelta = -1;
        this.alpha = 1;
    }
    if (this.alpha < 0) {
        this.alphaDelta = 1;
        this.alpha = 0;
    }
};

// Enemies our player must avoid
var Enemy = function (posX, posY, speedX, speedY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    GameItem.call(this, 'images/enemy-bug.png', posX, posY);
    this.speedFactor = 30;
    this.speed = {
        x: speedX,
        y: speedY
    };
};

Enemy.prototype = Object.create(GameItem.prototype);

Enemy.prototype.update = function (dt) {
    this.x = this.x + this.speed.x * dt * this.speedFactor;
    this.y = this.y + this.speed.y * dt * this.speedFactor;

    if (this.isOutside()) {
        this.restart();
    }
    //Acceleration of the bugs
    this.speedFactor = this.speedFactor + dt;
};

Enemy.prototype.isOutside = function () {
    if (this.x > canvas.width || this.y > canvas.height) {
        return true;
    } else {
        return false;
    };
};

Enemy.prototype.restart = function () {
    this.x = -100 - Math.random() * 100;
    this.y = Math.round(Math.random() * 3) * TILE_HEIGHT;
};


var Player = function () {
    GameItem.call(this, 'images/char-princess-girl.png', 3, 6);
};

Player.prototype = Object.create(GameItem.prototype);

Player.prototype.handleInput = function (direction) {
    switch (direction) {
    case 'left':
        if (this.x >= TILE_WIDTH)
            this.x = this.x - TILE_WIDTH;
        break;
    case 'right':
        if (this.x < 400)
            this.x = this.x + TILE_WIDTH;
        break;
    case 'up':
        if (this.y > 50)
            this.y = this.y - TILE_HEIGHT;
        break;
    case 'down':
        if (this.y < 407)
            this.y = this.y + TILE_HEIGHT;
        break;
    }
};


var start = function () {
    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player
    allEnemies = [new Enemy(-1, 2, 4, 0),
        new Enemy(-4, 3, 9, 0),
        new Enemy(-3, 4, 5, 0),
        new Enemy(-3, 5, 4, 0)
    ];
    player = new Player();
    gemstone = new Gemstone(3, 4);

};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});