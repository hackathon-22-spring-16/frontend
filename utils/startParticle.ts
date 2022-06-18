// 参考: https://coco-factory.jp/ugokuweb/move02/5-9/

export const startParticleOptions = {
  particles: {
    number: {
      value: 150, // 346, // この数値を変更すると星の数が増減できる
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: '#ffffff',
    },
    shape: {
      type: 'circle', // 形状はcircleを指定
      stroke: {
        width: 0,
      },
    },
    opacity: {
      value: 0.7, // シェイプの透明度
      random: true, // シェイプの透明度をランダムにする
      anim: {
        enable: true, // シェイプの透明度をアニメーションさせる
        // speed: 3, // シェイプの透明度をアニメーションさせる
        speed: 1,
        opacity_min: 0, // 透明度の最小値０
        sync: false, // 全てを同時にアニメーションさせない
      },
    },
    size: {
      value: 2,
      random: true,
      anim: {
        enable: true,
        speed: 4,
        size_min: 0.3,
        sync: false,
      },
    },
    line_linked: {
      enable: false,
    },
    move: {
      enable: true,
      speed: 0.1, // この数値を小さくするとゆっくりな動きになる
      // direction: 'none', // 方向指定なし
      direction: 'top-right', // 下から上に動く
      // random: true, // 動きはランダムに
      straight: true, // 動きをとどめる
      out_mode: 'out',
      bounce: false,
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 600,
      },
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: {
        enable: false,
      },
      onclick: {
        enable: false,
      },
      resize: true,
    },
  },
  retina_detect: true,
}
