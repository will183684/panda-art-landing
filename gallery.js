// 占位数据：替换成真实作品时，把 image 换成图片路径，其余字段按需要修改。
// 未经家长书面授权，请勿展示可辨认孩子面部或全名的作品/照片。
const artworks = [
  { age: "5 岁", theme: "海底世界", image: null },
  { age: "7 岁", theme: "我的小镇", image: null },
  { age: "9 岁", theme: "四季树", image: null },
  { age: "6 岁", theme: "太空冒险", image: null },
  { age: "11 岁", theme: "静物素描", image: null },
  { age: "8 岁", theme: "彩铅动物园", image: null }
];

function buildGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  artworks.forEach((art) => {
    const card = document.createElement("figure");
    card.className = "art-card";

    const media = document.createElement("div");
    media.className = "art-placeholder";
    if (art.image) {
      const img = document.createElement("img");
      img.src = art.image;
      img.alt = `${art.age}学员作品：${art.theme}`;
      media.appendChild(img);
      media.classList.add("has-image");
    } else {
      media.textContent = "🖼️";
    }
    card.appendChild(media);

    const caption = document.createElement("figcaption");
    caption.innerHTML = `<span>${art.age}</span><span>${art.theme}</span>`;
    card.appendChild(caption);

    grid.appendChild(card);
  });
}

buildGallery();
