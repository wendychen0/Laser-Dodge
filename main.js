title = "LASER DODGE";

description = `
[TAP] JUMP
`;

characters = [
  `
 ppp
 pccp
crrrcc
crrrcc
 pppp
 ppp`,
 `
 llll
ll lll
ll lll
 llll
`,
];

const G = {
  WIDTH: 80,
  HEIGHT: 100,
  laser_SPEED_MIN: 0.4,
  laser_SPEED_MAX: 0.8,
  player_speed: 0.5,
  coin_spawn_interval: 50,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  theme: "pixel",
};

/**
 * @typedef {{
* pos: Vector,
* vel: Vector,
* }} Player
*/

/**
* @type  { Player }
*/
let player;

/**
 * @typedef {{
* pos: Vector,
* speed: number
* }} Laser
*/

/**
* @type  { Laser [] }
*/
let lasers;

/** @type {Vector[]} */
let coins;
let nextCoinDist;

function update() {
  if (!ticks) {
    coins = [];
    nextCoinDist = G.coin_spawn_interval;
    lasers = times(7, () => {
      const posX = G.WIDTH + rnd(5, 25);
      const posY = rnd(5, G.HEIGHT-5);
      return {
        pos: vec(posX, posY),
        speed: rnd(G.laser_SPEED_MIN, G.laser_SPEED_MAX),
      };
    });

    player = {
      pos: vec(5, 45),
      vel: vec(),
    };
    color("black");
    char("a",player.pos)

    score = 0;
  } // end ticks

  let scr = 0;

  // PLAYER ----------------
  // When player taps to keep up
  if (input.isJustPressed) {
    player.vel.y -= sqrt(G.player_speed) * 1.5;
  } 
  player.vel.y += 0.06;
  player.vel.y *= 0.98;
  player.pos.y += player.vel.y;
  player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
  color("black");
  char("a", player.pos);

  // Making the top and bottom border
  color("light_blue")
  rect(0, 0, 128, 4) 
  rect(0, 96, 128, 4)

  // Update for coins
  nextCoinDist--;
  if (nextCoinDist < 0) {
    coins.push(vec(G.WIDTH, rnd(5, G.HEIGHT - 5)));
    nextCoinDist = G.coin_spawn_interval;
  }
  color("yellow");
  remove(coins, (c) => {
    c.x -= 1;
    const cl = char("b", c).isColliding.char;
    if (cl.a) {
      play("coin");
      addScore(1);
      return true;
    }
    if (c.x < -3) {
      return true;
    }
  });

  // Check if hits top or bottom
  if (player.pos.y + 3 > 96 || player.pos.y - 4 < 2) {
    play("hit");
    end();
  }

  // Update for lasers
  lasers.forEach((l, index) => {
    const laserColor = index % 2 === 0 ? "red" : "yellow";

    l.pos.x -= l.speed;
    color(laserColor);
    box(l.pos, 1.7);
    l.pos.wrap(0, G.WIDTH + 25, -5, G.HEIGHT);

    // Randomize laser positions after wrapping
    if (l.pos.x <= 0){
      l.pos.set(G.WIDTH, rnd(5, G.HEIGHT-5));
      l.speed = rnd(G.laser_SPEED_MIN, G.laser_SPEED_MAX);
      l.pos.x = rnd(-5, 15);
    }

    const IsCollidingWithLaser = box(l.pos, 1.7).isColliding.char.a;

    if (IsCollidingWithLaser){
      play("hit");
      end();
    }
  });
}
