// 默陌信笺手写体演示 - p5.js脚本
let myFont;
let particles = [];
let stars = [];
let fontSize = 50;
let angle = 0;
let animationEnabled = true;
let currentTextIndex = 0;
let bgColor1, bgColor2;

// 可切换的文本内容
const textContents = [
  "默陌信笺手写体",
  "手写之美，诗意生活",
  "落霞与孤鹜齐飞",
  "秋水共长天一色",
  "春风十里不如你",
  "心有灵犀一点通",
  "岁月静好，浅笑安然"
];

// 颜色主题
const colorThemes = [
  { primary: [80, 60, 40], secondary: [120, 90, 70] },   // 棕色系
  { primary: [40, 120, 180], secondary: [60, 140, 100] }, // 蓝绿系
  { primary: [180, 80, 120], secondary: [160, 60, 100] }, // 粉紫系
  { primary: [140, 100, 60], secondary: [100, 160, 80] }, // 金绿系
  { primary: [100, 80, 160], secondary: [140, 120, 200] }  // 紫蓝系
];
let currentTheme = 0;

function preload() {
  // 从GitHub加载字体文件
  // 注意：文件名必须与上传的文件名完全一致
  myFont = loadFont('默陌信笺手写体.ttf', 
    // 成功回调
    function(font) {
      console.log('✅ 字体加载成功！');
      updateStatus('success', '✅ 默陌信笺手写体加载成功！');
      updateGitHubStatus('字体加载成功');
    },
    // 失败回调
    function(err) {
      console.error('❌ 字体加载失败:', err);
      updateStatus('error', '❌ 字体加载失败，请检查文件名和网络连接');
      updateGitHubStatus('字体加载失败');
      
      // 尝试备用方案：使用在线字体
      console.log('尝试加载备用在线字体...');
      loadFont('https://fonts.gstatic.com/s/notosanssc/v28/k3kXo84MPvpLmixcA63oeALhL4iJ-Q7m8w.woff2', 
        function(backupFont) {
          myFont = backupFont;
          updateStatus('success', '✅ 使用备用在线字体');
        }
      );
    }
  );
}

function setup() {
  // 创建画布
  const canvas = createCanvas(800, 500);
  canvas.parent(document.querySelector('.sketch-container'));
  
  // 初始化背景颜色
  bgColor1 = color(255, 250, 245);
  bgColor2 = color(245, 255, 250);
  
  // 初始化粒子
  initParticles();
  initStars();
  
  // 更新页面信息
  updatePageInfo();
}

function draw() {
  // 绘制渐变背景
  drawGradientBackground();
  
  // 绘制星空效果
  drawStars();
  
  // 绘制粒子效果
  drawParticles();
  
  // 如果字体未加载，显示提示
  if (!myFont) {
    drawLoadingScreen();
    return;
  }
  
  // 设置字体
  textFont(myFont);
  textAlign(CENTER, CENTER);
  
  // 绘制主文本
  drawMainText();
  
  // 绘制装饰元素
  drawDecorations();
  
  // 绘制交互提示
  drawInteractionHint();
  
  // 更新动画
  if (animationEnabled) {
    angle += 0.015;
    fontSize = 50 + sin(angle) * 8;
    
    // 更新粒子
    updateParticles();
    updateStars();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      speed: random(0.5, 2),
      color: color(
        random(150, 250),
        random(150, 250),
        random(150, 250),
        random(50, 150)
      ),
      angle: random(TWO_PI),
      rotationSpeed: random(-0.02, 0.02)
    });
  }
}

function initStars() {
  stars = [];
  for (let i = 0; i < 50; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(0.5, 2),
      brightness: random(100, 255),
      twinkleSpeed: random(0.02, 0.05),
      phase: random(TWO_PI)
    });
  }
}

function drawGradientBackground() {
  // 创建动态渐变
  let inter = map(sin(frameCount * 0.005), -1, 1, 0, 1);
  let bgColor = lerpColor(bgColor1, bgColor2, inter);
  
  background(bgColor);
  
  // 添加微妙的纹理
  noFill();
  stroke(255, 255, 255, 30);
  strokeWeight(1);
  for (let i = 0; i < width; i += 50) {
    for (let j = 0; j < height; j += 50) {
      let size = 40 + sin(frameCount * 0.01 + i * 0.01 + j * 0.01) * 10;
      ellipse(i + 25, j + 25, size, size);
    }
  }
}

function drawStars() {
  for (let star of stars) {
    let brightness = star.brightness + sin(frameCount * star.twinkleSpeed + star.phase) * 50;
    fill(255, 255, 200, brightness);
    noStroke();
    ellipse(star.x, star.y, star.size);
  }
}

function drawParticles() {
  for (let p of particles) {
    push();
    translate(p.x, p.y);
    rotate(p.angle);
    
    fill(p.color);
    noStroke();
    
    // 绘制不同形状的粒子
    if (random() > 0.7) {
      rect(0, 0, p.size, p.size);
    } else {
      ellipse(0, 0, p.size);
    }
    
    pop();
  }
}

function updateParticles() {
  for (let p of particles) {
    p.y -= p.speed;
    p.x += sin(frameCount * 0.01 + p.y * 0.01) * 0.5;
    p.angle += p.rotationSpeed;
    
    if (p.y < -20) {
      p.y = height + 20;
      p.x = random(width);
    }
  }
}

function updateStars() {
  // 星空稍微移动
  for (let star of stars) {
    star.y += 0.1;
    if (star.y > height) {
      star.y = 0;
      star.x = random(width);
    }
  }
}

function drawMainText() {
  const theme = colorThemes[currentTheme];
  const waveY = 150 + sin(frameCount * 0.03) * 20;
  
  // 文本阴影（多层增强立体感）
  for (let i = 3; i > 0; i--) {
    fill(0, 0, 0, 20 * i);
    textSize(fontSize + i * 2);
    text(textContents[currentTextIndex], width/2 + i, waveY + i);
  }
  
  // 主文本
  fill(theme.primary[0], theme.primary[1], theme.primary[2]);
  textSize(fontSize);
  text(textContents[currentTextIndex], width/2, waveY);
  
  // 副文本
  fill(theme.secondary[0], theme.secondary[1], theme.secondary[2]);
  textSize(24);
  text('手写之美 · 诗意传承', width/2, waveY + 70);
  
  // 字体信息
  fill(100, 100, 100, 180);
  textSize(16);
  text('默陌信笺手写体 | GitHub Pages部署', width/2, waveY + 110);
}

function drawDecorations() {
  // 装饰线条
  stroke(200, 180, 150, 100);
  strokeWeight(2);
  noFill();
  
  // 左侧花纹
  push();
  translate(150, 250);
  rotate(sin(frameCount * 0.02) * 0.1);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let x = i * 15;
    let y = sin(i * 0.5 + frameCount * 0.05) * 20;
    vertex(x, y);
  }
  endShape();
  pop();
  
  // 右侧花纹
  push();
  translate(width - 150, 250);
  rotate(-sin(frameCount * 0.02) * 0.1);
  beginShape();
  for (let i = 0; i < 10; i++) {
    let x = -i * 15;
    let y = cos(i * 0.5 + frameCount * 0.05) * 20;
    vertex(x, y);
  }
  endShape();
  pop();
}

function drawInteractionHint() {
  fill(100, 100, 100, 150);
  textSize(14);
  text('点击画布添加特效 | 使用按钮控制动画', width/2, height - 30);
}

function drawLoadingScreen() {
  fill(0, 0, 0, 100);
  textSize(24);
  text('正在加载默陌信笺手写体...', width/2, height/2);
  
  // 加载动画
  let size = 20 + sin(frameCount * 0.1) * 10;
  fill(100, 150, 255, 150);
  ellipse(width/2, height/2 + 50, size);
}

// ============ UI更新函数 ============
function updateStatus(type, message) {
  const statusEl = document.getElementById('font-status');
  statusEl.className = `status-box ${type}`;
  statusEl.innerHTML = message;
}

function updateGitHubStatus(status) {
  document.getElementById('github-status').textContent = status;
}

function updatePageInfo() {
  // 更新页面URL
  const repoName = window.location.pathname.split('/')[1];
  const userName = window.location.pathname.split('/')[0] || 'your-username';
  const pageUrl = `https://${userName}.github.io/${repoName}/`;
  document.getElementById('page-url').innerHTML = `<a href="${pageUrl}" target="_blank">${pageUrl}</a>`;
  
  // 更新仓库链接
  const repoUrl = `https://github.com/${userName}/${repoName}`;
  document.getElementById('repo-link').innerHTML = `<a href="${repoUrl}" target="_blank">${repoUrl}</a>`;
}

// ============ 交互控制函数 ============
function changeBackground() {
  // 切换颜色主题
  currentTheme = (currentTheme + 1) % colorThemes.length;
  
  // 随机背景色
  bgColor1 = color(random(200, 255), random(200, 255), random(200, 255));
  bgColor2 = color(random(200, 255), random(200, 255), random(200, 255));
  
  // 添加粒子特效
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: mouseX || width/2,
      y: mouseY || height/2,
      size: random(3, 8),
      speed: random(2, 5),
      color: color(random(255), random(255), random(255), 200),
      angle: random(TWO_PI),
      rotationSpeed: random(-0.05, 0.05)
    });
  }
}

function toggleAnimation() {
  animationEnabled = !animationEnabled;
  const btn = document.querySelector('.btn-purple');
  if (animationEnabled) {
    btn.textContent = '暂停动画';
  } else {
    btn.textContent = '继续动画';
  }
}

function changeText() {
  currentTextIndex = (currentTextIndex + 1) % textContents.length;
  
  // 文字切换特效
  for (let i = 0; i < 50; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      brightness: 255,
      twinkleSpeed: 0.1,
      phase: random(TWO_PI)
    });
  }
}

function resetSketch() {
  // 重置所有效果
  initParticles();
  initStars();
  currentTheme = 0;
  currentTextIndex = 0;
  animationEnabled = true;
  fontSize = 50;
  angle = 0;
  
  bgColor1 = color(255, 250, 245);
  bgColor2 = color(245, 255, 250);
  
  document.querySelector('.btn-purple').textContent = '暂停动画';
}

// 画布点击事件
function mousePressed() {
  if (!myFont) return;
  
  // 在点击位置创建特效
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: mouseX,
      y: mouseY,
      size: random(2, 6),
      speed: random(1, 4),
      color: color(random(255), random(255), random(255), 150),
      angle: random(TWO_PI),
      rotationSpeed: random(-0.03, 0.03)
    });
  }
  
  // 添加星爆效果
  for (let i = 0; i < 10; i++) {
    stars.push({
      x: mouseX,
      y: mouseY,
      size: random(1, 4),
      brightness: 255,
      twinkleSpeed: 0.2,
      phase: random(TWO_PI)
    });
  }
}

// 窗口调整大小
function windowResized() {
  resizeCanvas(800, 500);
  initParticles();
  initStars();
}

// 页面加载完成
window.addEventListener('load', function() {
  console.log('页面加载完成');
  updatePageInfo();
});
