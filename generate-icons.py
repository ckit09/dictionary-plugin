"""
Generate simple PNG icons for the Dictionary extension.
This script creates three PNG files: 16x16, 48x48, and 128x128
with a blue background and white "D" letter.

Prerequisites: pip install pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a simple icon with the letter D"""
    # Create image with blue background
    img = Image.new('RGB', (size, size), color=(66, 133, 244))
    draw = ImageDraw.Draw(img)
    
    # Try to use a built-in font or default
    try:
        # Try to use a larger font size
        font_size = int(size * 0.6)
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Draw white "D" in the center
    text = "D"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size - text_width) // 2
    y = (size - text_height) // 2
    
    draw.text((x, y), text, fill=(255, 255, 255), font=font)
    
    # Save the image
    img.save(filename)
    print(f"✓ Created {filename} ({size}x{size})")

# Create icons directory if it doesn't exist
os.makedirs('icons', exist_ok=True)

# Generate the three required icons
print("Generating dictionary extension icons...")
create_icon(16, 'icons/icon-16.png')
create_icon(48, 'icons/icon-48.png')
create_icon(128, 'icons/icon-128.png')

print("\n✓ All icons created successfully!")
print("The extension is ready to load in Chrome.")
