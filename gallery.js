// 占位数据：替换成真实作品时，把 image 换成图片路径，其余字段按需要修改。
// 未经家长书面授权，请勿展示可辨认孩子面部或全名的作品/照片。
const artworks = [
  { age: "3 岁", theme: "小考拉", image: "assets/gallery/age3-koala.jpg" },
  { age: "4 岁", theme: "麦当劳叔叔", image: "assets/gallery/age4-mcdonalds.jpg" },
  { age: "5 岁", theme: "厨师海象", image: "assets/gallery/age5-chef-walrus.jpg" },
  { age: "6 岁", theme: "线描冰淇淋", image: "assets/gallery/age6-ice-cream.jpg" },
  { age: "7 岁", theme: "南极的吹风机", image: "assets/gallery/age7-hair-drier.jpg" },
  { age: "8 岁", theme: "彩铅莲藕", image: "assets/gallery/age8-lotus-root.jpg" }
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
