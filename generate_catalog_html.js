const fs = require('fs');
const path = require('path');

/**
 * CONFIGURATION
 * Adjust these values for different categories
 */
const CONFIG = {
    // 1 NT$ = 500 IDR
    EXCHANGE_RATE: 500,

    // Selectors for appending content
    // We look for the closing of the product grid to append new items
    GRID_CLOSING_REGEX: /(<\/div>\s*<\/main>)/, // Matches the </div> closing the .product-grid, followed by </main>

    // Default image if missing
    DEFAULT_IMAGE: 'images/placeholder-bean.jpg'
};

// Formatting Helper
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

// Description Parsing Helper
function parseDescriptionToGrid(descText) {
    if (!descText) return '';

    const keys = ['Flavor', 'Roast', 'Region', 'Variety', 'Process', 'Altitude', 'Weight', 'Sweetness'];
    const lines = descText.split('\n');
    let html = '<div class="product-description-grid">';

    lines.forEach(line => {
        let matchedKey = null;
        for (const key of keys) {
            // Check for Key followed by separators like : ｜ ／ |
            if (line.includes(key) && (line.match(/[:｜／|]/))) {
                matchedKey = key;
                break;
            }
        }

        if (matchedKey) {
            // Extract value
            let value = line.replace(matchedKey, '').replace(/[:｜／|]/, '').trim();
            // Clean up common scraping artifacts
            if (value.startsWith('s')) value = value.substring(1); // Fix 'sPink Guava' -> 'Pink Guava'
            if (value.startsWith('ing Profile')) value = value.replace('ing Profile', '').trim();
            if (value.startsWith('Development')) value = value.replace('Development', '').trim();
            if (value.startsWith('ing')) value = value.substring(3).trim(); // Fix 'ingNatural'

            if (value) {
                html += `<div class="desc-item"><span>${matchedKey}:</span> ${value}</div>`;
            }
        }
    });

    html += '</div>';
    return html;
}

// Card HTML Generator
function createProductCard(product, categoryTag) {
    // Price Parsing
    let priceNT = 0;
    try {
        const priceMatch = product.price ? product.price.match(/[\d,]+/) : null;
        if (priceMatch) {
            priceNT = parseInt(priceMatch[0].replace(/,/g, ''));
        }
    } catch (e) {
        // Fallback or ignore
    }
    const priceIDR = priceNT * CONFIG.EXCHANGE_RATE;

    // Title Cleaning
    const cleanTitle = product.title.split('/')[0].trim();

    // Image Handling
    const imageSrc = product.image || CONFIG.DEFAULT_IMAGE;

    // Description HTML
    const descHtml = parseDescriptionToGrid(product.description);

    return `
                <div class="product-card" data-category="${categoryTag}" data-price="${priceIDR}">
                    <img src="${imageSrc}" class="product-image" alt="${cleanTitle}">
                    <div class="product-info">
                        <div class="product-title">${cleanTitle}</div>
                        <div class="product-price">${formatCurrency(priceIDR)}</div>
                        
                        ${descHtml}

                        <!-- Add to Cart Button -->
                        <button class="add-to-cart-small" onclick="window.updateAndStopProp(null, 1, event, '${cleanTitle.replace(/'/g, "\\'")}', '${priceIDR}', '${imageSrc}', 'Beans')">
                            Add to Cart
                        </button>
                    </div>
                </div>`;
}

// Main Function
function generateCatalog(jsonPath, targetHtmlPath, categoryTag = 'single-origin') {
    try {
        console.log(`Reading JSON from ${jsonPath}...`);
        const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

        console.log(`Reading HTML from ${targetHtmlPath}...`);
        let targetHtml = fs.readFileSync(targetHtmlPath, 'utf8');

        // Locate insertion point
        const match = targetHtml.match(CONFIG.GRID_CLOSING_REGEX);
        if (!match) {
            throw new Error('Could not find insertion point (closing div of product-grid).');
        }

        let newCardsHtml = '';
        let count = 0;

        products.forEach(p => {
            // Basic deduplication: check if title already exists in HTML
            // This is a naive check, can be improved
            const cleanTitle = p.title.split('/')[0].trim();
            if (targetHtml.includes(cleanTitle)) {
                console.log(`Skipping duplicate: ${cleanTitle}`);
                return;
            }

            newCardsHtml += createProductCard(p, categoryTag) + '\n';
            count++;
        });

        if (count === 0) {
            console.log('No new products to add.');
            return;
        }

        const insertionIndex = match.index;
        const newHtml = targetHtml.slice(0, insertionIndex) + newCardsHtml + targetHtml.slice(insertionIndex);

        fs.writeFileSync(targetHtmlPath, newHtml);
        console.log(`Successfully appended ${count} new products to ${path.basename(targetHtmlPath)}`);

    } catch (error) {
        console.error('Error generating catalog:', error);
    }
}

// CLI config
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node generate_catalog_html.js <json_file> <target_html_file> [category_tag]');
} else {
    generateCatalog(args[0], args[1], args[2] || 'single-origin');
}
