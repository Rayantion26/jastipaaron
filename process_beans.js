
const products = [
    {
        "name": "Panama Boquete LONGBOARD COFFEE Misty Mountain Farm Geisha Lot.33 Washed",
        "price": "NT$1,980",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/693a76c3bdc4705282f2daef/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Peach、Yellow Lemon、Orange Blossom、Lemon Glaze、Jasmine",
            "sweetness": "Candy",
            "roasting": "Light",
            "weight": "20g In Corning Centrifuge",
            "region": "Boquete",
            "variety": "Geisha",
            "processing": "Washed",
            "altitude": "1550-1800 Meter"
        }
    },
    {
        "name": "Panama Boquete LONGBOARD COFFEE Windy Ridge Farm Geisha Lot.10 Natural",
        "price": "NT$1,980 ~ NT$7,390",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d610a6b70024fbc627/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Tangerine, Apricot Jelly Candy, Fuji Apple, Hibiscus, Orange Blossom",
            "sweetness": "Candy",
            "roasting": "Light",
            "weight": "20g In Corning Centrifuge / 113g In Aluminum Bottle",
            "region": "Boquete",
            "variety": "Geisha",
            "processing": "Natural",
            "altitude": "1600 Meter"
        }
    },
    {
        "name": "Ethiopia Sidama Bensa Alo Single Variety 74158 Washed【JH LA FLOR series】",
        "price": "NT$840",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d618074d001a4f1aa0/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Jasmine, Lemon Peel, Bergamot, White Peach, Floral Tea",
            "sweetness": "Candy",
            "roasting": "Light",
            "weight": "113g In Aluminum Bottle",
            "region": "Sidama Bensa",
            "variety": "74158",
            "processing": "Washed",
            "altitude": "2000-2400 Meter"
        }
    },
    {
        "name": "Ethiopia Sidama Bona G1 Natural【JH LA MIEL series】",
        "price": "NT$520",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d6647c68001a4827ed/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Blueberry, Strawberry Jam, Cocoa, Honey, Red Grape",
            "sweetness": "Candy Bit More",
            "roasting": "Light Medium",
            "weight": "113g In Aluminum Bottle",
            "region": "Sidama Bona",
            "variety": "Local Landrace",
            "processing": "Natural",
            "altitude": "1900-2200 Meter"
        }
    },
    {
        "name": "Taiwan Chiayi Alishan Tefuye HUNTER STORY STUDIO Honey【COE Auction 2025】",
        "price": "NT$1,270",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d610a6b70024fbc627/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Osmanthus, Honey, Peach, Oolong Tea, Brown Sugar",
            "sweetness": "Honey",
            "roasting": "Light Medium",
            "weight": "113g In Aluminum Bottle",
            "region": "Alishan",
            "variety": "Typica & Bourbon",
            "processing": "Honey",
            "altitude": "1200-1400 Meter"
        }
    },
    {
        "name": "Panama Boquete Hacienda La Esmeralda Plot.LEON Geisha Natural",
        "price": "NT$2,990",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d610a6b70024fbc627/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Cranberry, Elderflower, Orange Blossom, Sun Dried Rose Petals, Tangerine",
            "sweetness": "Candy",
            "roasting": "Light",
            "weight": "113g In Aluminum Bottle",
            "region": "Boquete",
            "variety": "Geisha",
            "processing": "Natural",
            "altitude": "1600-1800 Meter"
        }
    },
    {
        "name": "Panama Morgan Estate Geisha CM Natural",
        "price": "NT$3,780",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d618074d00144f1552/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Purple Floral, Grape, Tropical Fruit, Winey",
            "region": "Chiriqui",
            "variety": "Geisha",
            "processing": "CM Natural",
            "altitude": "1700-1850m",
            "roasting": "Light",
            "sweetness": "Jammy",
            "weight": "113g"
        }
    },
    {
        "name": "Panama Altieri Estate Geisha Washed",
        "price": "NT$2,430",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d618074d00144f1552/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Jasmine, Lemon, Bergamot, Tea-like",
            "region": "Boquete",
            "variety": "Geisha",
            "processing": "Washed",
            "altitude": "1800m",
            "roasting": "Light",
            "sweetness": "Clean",
            "weight": "113g"
        }
    },
    {
        "name": "Alishan Tefuye Yangui Farm Geisha (COE 2025)",
        "price": "NT$1,710",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d640020a514830b0dc/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Floral, Oolong, Honey, Stone Fruit",
            "region": "Alishan",
            "variety": "Geisha",
            "processing": "Washed",
            "altitude": "1200m",
            "roasting": "Light",
            "sweetness": "Honey",
            "weight": "113g"
        }
    },
    {
        "name": "Panama Ponderosa Estate Sidra Natural",
        "price": "NT$1,550",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d61c353d00141f5634/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Tropical Fruit, Pineapple, Mango, Complex",
            "region": "Boquete",
            "variety": "Sidra",
            "processing": "Natural",
            "altitude": "1650m",
            "roasting": "Light",
            "sweetness": "Fruity",
            "weight": "113g"
        }
    },
    {
        "name": "Ethiopia Yirgacheffe Halo Bariti G1",
        "price": "NT$1,300",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/6170f3a3480c75002960bc98/800x.webp?source_format=png",
        "description": {
            "flavors": "Berries, Floral, Citrus, Clean",
            "region": "Yirgacheffe",
            "variety": "Heirloom",
            "processing": "Washed",
            "altitude": "2000m",
            "roasting": "Light",
            "sweetness": "Sugary",
            "weight": "113g"
        }
    },
    {
        "name": "Ethiopia Guji Hambella Bella Lulo G1",
        "price": "NT$1,190",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/6170f3a3480c75002960bc98/800x.webp?source_format=png",
        "description": {
            "flavors": "Floral, Black Tea, Lemon, Peach",
            "region": "Guji",
            "variety": "Heirloom",
            "processing": "Washed",
            "altitude": "2100m",
            "roasting": "Light",
            "sweetness": "Vibrant",
            "weight": "113g"
        }
    },
    {
        "name": "Panama Mil Cumbres Maracaturra Natural",
        "price": "NT$1,150",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d640020a514830b0dc/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Dark Berries, Winey, Chocolate, Body",
            "region": "Cordillera",
            "variety": "Maracaturra",
            "processing": "Natural",
            "altitude": "1700m",
            "roasting": "Medium Light",
            "sweetness": "Rich",
            "weight": "113g"
        }
    },
    {
        "name": "Kenya Nyeri Karangatha AA TOP",
        "price": "NT$1,110",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/6170f3a3480c75002960bc98/800x.webp?source_format=png",
        "description": {
            "flavors": "Blackcurrant, Tomato, Grapefruit, Acidic",
            "region": "Nyeri",
            "variety": "SL28, SL34",
            "processing": "Washed",
            "altitude": "1800m",
            "roasting": "Medium Light",
            "sweetness": "Juicy",
            "weight": "113g"
        }
    },
    {
        "name": "Kenya Kiambu Ruera Natural",
        "price": "NT$770",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/65d473d61c353d00141f5634/800x.webp?source_format=jpg",
        "description": {
            "flavors": "Plum, Raisin, Dark Chocolate, Syrupy",
            "region": "Kiambu",
            "variety": "SL28",
            "processing": "Natural",
            "altitude": "1600m",
            "roasting": "Medium",
            "sweetness": "Syrupy",
            "weight": "113g"
        }
    },
    {
        "name": "Brazil Minas Gerais Daterra Red Catuai",
        "price": "NT$690",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/6170f3a2cb709c51b8eb8146/800x.webp?source_format=png",
        "description": {
            "flavors": "Nutty, Chocolate, Caramel, Smooth",
            "region": "Minas Gerais",
            "variety": "Red Catuai",
            "processing": "Natural",
            "altitude": "1100m",
            "roasting": "Medium",
            "sweetness": "Caramel",
            "weight": "113g"
        }
    },
    {
        "name": "Indonesia Sumatra Lintong Lake Toba",
        "price": "NT$630",
        "image": "https://shoplineimg.com/554c75fa039055280b00006e/6170f3a2cdd2ab003842ba4c/800x.webp?source_format=png",
        "description": {
            "flavors": "Herbal, Earthy, Cedar, Full Body",
            "region": "Lintong",
            "variety": "Ateng",
            "processing": "Wet Hulled",
            "altitude": "1400m",
            "roasting": "Medium Dark",
            "sweetness": "Spicy",
            "weight": "113g"
        }
    }
];

// Process logic
const processProducts = (data) => {
    return data.map(p => {
        let priceNum = 0;
        if (p.price && p.price !== 'N/A') {
            const match = p.price.match(/[\d,]+/);
            if (match) {
                priceNum = parseInt(match[0].replace(/,/g, ''), 10);
            }
        }
        const idrPrice = priceNum * 500;

        return {
            ...p,
            idrPrice: idrPrice,
            formattedPrice: `Rp ${idrPrice.toLocaleString()}`
        };
    });
};

const processed = processProducts(products);

// Generate HTML Content
let htmlContent = '';
processed.forEach(p => {
    const d = p.description || {};
    htmlContent += `
    <div class="product-card" data-category="single-origin" data-price="${p.idrPrice}">
        <img src="${p.image}" class="product-image" alt="${p.name}">
        <div class="product-info">
            <div class="product-title">${p.name}</div>
            <div class="product-price">${p.formattedPrice}</div>
            
            <div class="product-description-grid">
                ${d.flavors ? `<div class="desc-item"><span>Flavor:</span> ${d.flavors}</div>` : ''}
                ${d.roasting ? `<div class="desc-item"><span>Roast:</span> ${d.roasting}</div>` : ''}
                ${d.region ? `<div class="desc-item"><span>Region:</span> ${d.region}</div>` : ''}
                ${d.variety ? `<div class="desc-item"><span>Variety:</span> ${d.variety}</div>` : ''}
                ${d.processing ? `<div class="desc-item"><span>Process:</span> ${d.processing}</div>` : ''}
                ${d.altitude ? `<div class="desc-item"><span>Altitude:</span> ${d.altitude}</div>` : ''}
            </div>
            
            <!-- Add to Cart Button (absolute positioned bottom right) -->
            <button class="add-to-cart-small" 
                onclick="window.updateAndStopProp(null, 1, event, '${p.name.replace(/'/g, "\\'")}', '${p.idrPrice}', '${p.image}', 'Beans')">
                Add to Cart
            </button>
        </div>
    </div>
    `;
});

const fs = require('fs');
fs.writeFileSync('coffee_content.html', htmlContent);
console.log('Successfully wrote content to coffee_content.html');
