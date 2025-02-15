#!/usr/bin/env python3
"""
Advanced Aesthetic Color Scheme Generator (Enhanced)

This tool generates color palettes designed for brand aesthetics. In addition to
basic schemes, it now includes tetradic, monochromatic, specific hue choice,
temperature (warm/cool) options, and vibrancy settings (loud vs. quiet).
Explanations for each generation option help guide users in selecting the right
scheme for their brand’s personality.

Author: [Your Name]
Date: 2025-02-14
"""

import random
import colorsys
import matplotlib.pyplot as plt

# ---------------------------
# Utility Functions
# ---------------------------
def hex_to_rgb(hex_color):
    """Convert hex string (e.g. '#1E90FF') to an RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb):
    """Convert an RGB tuple (values 0-255) to a hex string."""
    return '#' + ''.join(f'{c:02X}' for c in rgb)

# ---------------------------
# Basic Color Harmony Functions
# ---------------------------
def generate_complementary(hex_color, vibrancy=1.0):
    """
    Generate the complementary color.
    vibrancy scales the saturation (1.0 is full, <1.0 is muted).
    """
    rgb = hex_to_rgb(hex_color)
    h, l, s = colorsys.rgb_to_hls(*(c/255 for c in rgb))
    # Adjust saturation for vibrancy
    s = max(0, min(s * vibrancy, 1))
    comp_h = (h + 0.5) % 1.0
    comp_rgb = colorsys.hls_to_rgb(comp_h, l, s)
    comp_rgb_int = tuple(int(c * 255) for c in comp_rgb)
    return rgb_to_hex(comp_rgb_int)

def generate_analogous(hex_color, angle=30, vibrancy=1.0):
    """
    Generate two analogous colors by shifting the hue ±angle degrees.
    Angle is in degrees; vibrancy adjusts saturation.
    """
    rgb = hex_to_rgb(hex_color)
    h, l, s = colorsys.rgb_to_hls(*(c/255 for c in rgb))
    s = max(0, min(s * vibrancy, 1))
    angle_norm = angle / 360.0
    ana1 = colorsys.hls_to_rgb((h + angle_norm) % 1.0, l, s)
    ana2 = colorsys.hls_to_rgb((h - angle_norm) % 1.0, l, s)
    ana1_hex = rgb_to_hex(tuple(int(c * 255) for c in ana1))
    ana2_hex = rgb_to_hex(tuple(int(c * 255) for c in ana2))
    return ana1_hex, ana2_hex

def generate_triadic(hex_color, vibrancy=1.0):
    """
    Generate a triadic palette (three colors evenly spaced around the wheel).
    """
    rgb = hex_to_rgb(hex_color)
    h, l, s = colorsys.rgb_to_hls(*(c/255 for c in rgb))
    s = max(0, min(s * vibrancy, 1))
    triad1 = colorsys.hls_to_rgb((h + 1/3) % 1.0, l, s)
    triad2 = colorsys.hls_to_rgb((h + 2/3) % 1.0, l, s)
    triad1_hex = rgb_to_hex(tuple(int(c * 255) for c in triad1))
    triad2_hex = rgb_to_hex(tuple(int(c * 255) for c in triad2))
    return triad1_hex, triad2_hex

# ---------------------------
# Advanced Generation Functions
# ---------------------------
def generate_tetradic(hex_color, vibrancy=1.0):
    """
    Generate a tetradic palette: four colors forming a rectangle on the color wheel.
    Returns a list of four HEX codes.
    """
    rgb = hex_to_rgb(hex_color)
    h, l, s = colorsys.rgb_to_hls(*(c/255 for c in rgb))
    s = max(0, min(s * vibrancy, 1))
    # Offsets of 0, 0.25, 0.5, 0.75 give four evenly spaced hues.
    hues = [(h + offset) % 1.0 for offset in (0, 0.25, 0.5, 0.75)]
    palette = []
    for new_h in hues:
        new_rgb = colorsys.hls_to_rgb(new_h, l, s)
        new_rgb_int = tuple(int(c * 255) for c in new_rgb)
        palette.append(rgb_to_hex(new_rgb_int))
    return palette

def generate_monochromatic(hex_color, num_variations=5):
    """
    Generate a monochromatic palette by varying the lightness.
    Returns a list of num_variations HEX codes that are variations of the base color.
    """
    rgb = hex_to_rgb(hex_color)
    h, l, s = colorsys.rgb_to_hls(*(c/255 for c in rgb))
    # Create a range of lightness values
    lightness_values = [max(0, min(l + delta, 1)) for delta in 
                        [-(num_variations//2)*0.1 + i*0.1 for i in range(num_variations)]]
    palette = []
    for new_l in lightness_values:
        new_rgb = colorsys.hls_to_rgb(h, new_l, s)
        new_rgb_int = tuple(int(c * 255) for c in new_rgb)
        palette.append(rgb_to_hex(new_rgb_int))
    return palette

def generate_hue_choice(hue_deg, vibrancy=1.0):
    """
    Generate a base color from a specified hue (0-360 degrees).
    Returns the HEX code for that color with default lightness 0.5.
    """
    h = (hue_deg % 360) / 360.0
    # Default lightness and saturation; adjust saturation per vibrancy.
    l = 0.5
    s = max(0, min(1.0 * vibrancy, 1))
    rgb = colorsys.hls_to_rgb(h, l, s)
    rgb_int = tuple(int(c * 255) for c in rgb)
    return rgb_to_hex(rgb_int)

def generate_temperature_palette(temp='warm', scheme='analogous', vibrancy=1.0):
    """
    Generate a palette based on temperature.
    'warm' chooses a base color from red/orange/yellow; 'cool' from blue/green/purple.
    Then applies a basic scheme.
    """
    if temp.lower() == 'warm':
        # Warm hues roughly between 0° and 60°.
        hue = random.randint(0, 60)
    else:
        # Cool hues roughly between 180° and 300°.
        hue = random.randint(180, 300)
    base_color = generate_hue_choice(hue, vibrancy=vibrancy)
    # Use the chosen scheme to build the palette.
    if scheme == 'complementary':
        palette = [base_color, generate_complementary(base_color, vibrancy)]
    elif scheme == 'triadic':
        t1, t2 = generate_triadic(base_color, vibrancy)
        palette = [base_color, t1, t2]
    else:
        # Default to analogous.
        a1, a2 = generate_analogous(base_color, angle=30, vibrancy=vibrancy)
        palette = [base_color, a1, a2]
    return palette

def generate_vibrancy_palette(hex_color, style='loud'):
    """
    Adjust the palette vibrancy.
    For 'loud', use full saturation; for 'quiet', reduce saturation.
    Here we generate a complementary scheme as an example.
    """
    vibrancy = 1.0 if style == 'loud' else 0.5
    return [hex_color, generate_complementary(hex_color, vibrancy)]

# ---------------------------
# Expanded Theme Choices
# ---------------------------
THEME_KEYWORDS = {
    "ocean":     {"base": "#1E90FF", "description": "Calm, trustworthy, and serene (cool blue)."},
    "woodland":  {"base": "#228B22", "description": "Natural and earthy with growth (forest green)."},
    "city":      {"base": "#708090", "description": "Modern and sophisticated (slate gray)."},
    "sunset":    {"base": "#FF4500", "description": "Energetic and passionate (vivid orange-red)."},
    "vintage":   {"base": "#8B4513", "description": "Classic and reliable (rich brown)."},
    "desert":    {"base": "#EDC9Af", "description": "Warm and sandy (light tan) evoking arid landscapes."},
    "midnight":  {"base": "#191970", "description": "Mysterious and deep (midnight blue)."},
    "pastel":    {"base": "#FFD1DC", "description": "Soft and gentle (pastel pink) for a calming feel."},
    "neon":      {"base": "#39FF14", "description": "Bold and vibrant (neon green) for an energetic vibe."},
    "tropical":  {"base": "#FF6347", "description": "Lively and warm (tomato red) reminiscent of tropical sunsets."},
    "romantic":  {"base": "#FF69B4", "description": "Playful and affectionate (hot pink)."},
    "modern":    {"base": "#2F4F4F", "description": "Sleek and minimal (dark slate gray)."},
    "industrial":{"base": "#696969", "description": "Utilitarian and robust (dim gray)."},
    "playful":   {"base": "#FF1493", "description": "Fun and energetic (deep pink)."}
}

def generate_palette_from_keyword(keyword, scheme='analogous', advanced_option=None, **kwargs):
    """
    Generate a palette based on a keyword theme.
    advanced_option can be used to override the scheme with one of:
      'complementary', 'analogous', 'triadic', 'tetradic', 'monochromatic',
      'hue', 'temperature', or 'vibrancy'.
    Additional parameters (like vibrancy) are passed via kwargs.
    """
    key = keyword.lower()
    if key in THEME_KEYWORDS:
        base_color = THEME_KEYWORDS[key]["base"]
    else:
        print(f"Keyword '{keyword}' not recognized. Using a random color.")
        base_color = '#{:06X}'.format(random.randint(0, 0xFFFFFF))
    
    # If an advanced option is specified, use the corresponding function.
    if advanced_option == 'triadic':
        palette = [base_color] + list(generate_triadic(base_color, kwargs.get('vibrancy', 1.0)))
    elif advanced_option == 'complementary':
        palette = [base_color, generate_complementary(base_color, kwargs.get('vibrancy', 1.0))]
    elif advanced_option == 'analogous':
        palette = [base_color] + list(generate_analogous(base_color, angle=30, vibrancy=kwargs.get('vibrancy', 1.0)))
    elif advanced_option == 'tetradic':
        palette = generate_tetradic(base_color, kwargs.get('vibrancy', 1.0))
    elif advanced_option == 'monochromatic':
        palette = generate_monochromatic(base_color, num_variations=5)
    elif advanced_option == 'hue':
        # Expect a 'hue' parameter in kwargs (0-360)
        hue = kwargs.get('hue', 0)
        new_base = generate_hue_choice(hue, kwargs.get('vibrancy', 1.0))
        palette = [new_base] + list(generate_analogous(new_base, angle=30, vibrancy=kwargs.get('vibrancy', 1.0)))
    elif advanced_option == 'temperature':
        # Expect a 'temperature' parameter in kwargs ('warm' or 'cool')
        temp = kwargs.get('temperature', 'warm')
        palette = generate_temperature_palette(temp, scheme=scheme, vibrancy=kwargs.get('vibrancy', 1.0))
    elif advanced_option == 'vibrancy':
        # Expect a 'style' parameter in kwargs ('loud' or 'quiet')
        style = kwargs.get('style', 'loud')
        palette = generate_vibrancy_palette(base_color, style=style)
    else:
        # Default to analogous if no advanced option is specified.
        palette = [base_color] + list(generate_analogous(base_color, angle=30, vibrancy=kwargs.get('vibrancy', 1.0)))
    return palette

# ---------------------------
# Visualization Function
# ---------------------------
def display_palette(palette):
    """Display the color palette as swatches using matplotlib."""
    num_colors = len(palette)
    fig, ax = plt.subplots(figsize=(num_colors * 2, 2))
    for i, color in enumerate(palette):
        ax.add_patch(plt.Rectangle((i, 0), 1, 1, color=color))
        ax.text(i + 0.5, -0.1, color, ha='center', va='top', fontsize=10)
    ax.set_xlim(0, num_colors)
    ax.set_ylim(0, 1)
    ax.axis('off')
    plt.tight_layout()
    plt.show()

# ---------------------------
# Interactive CLI
# ---------------------------
def advanced_menu():
    """Advanced palette generation options with explanations."""
    print("\n--- Advanced Palette Generation ---")
    print("Choose a generation option and learn what it does:")
    print("a. Complementary - Uses a base color and its opposite on the color wheel for high contrast.")
    print("b. Analogous - Selects colors adjacent to the base for a harmonious look.")
    print("c. Triadic - Picks three evenly spaced colors for a balanced, vibrant feel.")
    print("d. Tetradic - Generates four colors forming two complementary pairs for rich variety.")
    print("e. Monochromatic - Varies lightness of a single hue for a unified, subtle palette.")
    print("f. Hue Choice - Let you specify a hue (0-360°) as the anchor color.")
    print("g. Temperature - Generate a 'warm' (reds/oranges/yellows) or 'cool' (blues/greens/purples) palette.")
    print("h. Vibrancy - Choose 'loud' (full saturation) or 'quiet' (muted) style.")
    option = input("Enter a letter (a-h): ").strip().lower()
    vibrancy = 1.0  # default vibrancy (loud)
    extra_kwargs = {}
    if option == 'a':
        advanced = 'complementary'
    elif option == 'b':
        advanced = 'analogous'
    elif option == 'c':
        advanced = 'triadic'
    elif option == 'd':
        advanced = 'tetradic'
    elif option == 'e':
        advanced = 'monochromatic'
    elif option == 'f':
        advanced = 'hue'
        try:
            hue_val = float(input("Enter your desired hue (0-360): ").strip())
        except ValueError:
            hue_val = 0
        extra_kwargs['hue'] = hue_val
    elif option == 'g':
        advanced = 'temperature'
        temp_choice = input("Choose temperature ('warm' or 'cool'): ").strip().lower()
        extra_kwargs['temperature'] = temp_choice if temp_choice in ['warm', 'cool'] else 'warm'
    elif option == 'h':
        advanced = 'vibrancy'
        style = input("Choose vibrancy style ('loud' for vibrant, 'quiet' for muted): ").strip().lower()
        extra_kwargs['style'] = style if style in ['loud', 'quiet'] else 'loud'
    else:
        print("Invalid option. Defaulting to Analogous.")
        advanced = 'analogous'
    # Ask if user wants to adjust vibrancy overall (e.g., for extra muted or extra vibrant)
    try:
        vib = float(input("Optional: Enter a vibrancy multiplier (e.g., 1.0 for normal, 0.5 for muted, 1.5 for extra vibrant) [default 1.0]: ").strip() or "1.0")
    except ValueError:
        vib = 1.0
    extra_kwargs['vibrancy'] = vib
    return advanced, extra_kwargs

def main():
    print("=== Advanced Aesthetic Color Scheme Generator ===")
    print("This tool uses color theory and psychology to generate harmonious palettes.")
    print("Choose an option:")
    print("1. Generate a basic palette from scratch (random base color)")
    print("2. Generate a palette based on a keyword theme")
    print("3. Advanced palette generation options")
    choice = input("Enter 1, 2, or 3: ").strip()

    scheme_options = {
        'a': 'complementary',
        'b': 'analogous',
        'c': 'triadic'
    }
    
    if choice == '1':
        print("\nSelect a basic harmony scheme:")
        print("a. Complementary - High contrast")
        print("b. Analogous - Harmonious and subtle")
        print("c. Triadic - Balanced and vibrant")
        sch_choice = input("Enter a, b, or c: ").strip().lower()
        scheme = scheme_options.get(sch_choice, 'complementary')
        palette = generate_palette(hex_color=None, scheme=scheme)
        print("\nGenerated Palette:")
        for color in palette:
            print(color)
        display_palette(palette)

    elif choice == '2':
        print("\nAvailable keyword themes:")
        for key, value in THEME_KEYWORDS.items():
            print(f" - {key.title()}: {value['description']}")
        keyword = input("Enter a keyword from above: ").strip().lower()
        print("\nSelect a basic harmony scheme for the theme:")
        print("a. Complementary")
        print("b. Analogous")
        print("c. Triadic")
        sch_choice = input("Enter a, b, or c: ").strip().lower()
        scheme = scheme_options.get(sch_choice, 'analogous')
        palette = generate_palette_from_keyword(keyword, scheme=scheme)
        print(f"\nGenerated Palette for '{keyword.title()}':")
        for color in palette:
            print(color)
        display_palette(palette)

    elif choice == '3':
        print("\n--- Advanced Options ---")
        print("You can choose from multiple advanced generation methods with detailed guidance.")
        adv_option, extra_kwargs = advanced_menu()
        # For advanced options based on theme, you can still choose a keyword:
        use_theme = input("Would you like to base the palette on a theme keyword? (y/n): ").strip().lower()
        if use_theme == 'y':
            print("\nAvailable keyword themes:")
            for key, value in THEME_KEYWORDS.items():
                print(f" - {key.title()}: {value['description']}")
            keyword = input("Enter a keyword: ").strip().lower()
            palette = generate_palette_from_keyword(keyword, advanced_option=adv_option, **extra_kwargs)
            print(f"\nGenerated Advanced Palette for '{keyword.title()}':")
        else:
            # Use a random base color
            base_color = '#{:06X}'.format(random.randint(0, 0xFFFFFF))
            # Depending on the advanced option, call the corresponding function:
            if adv_option == 'complementary':
                palette = [base_color, generate_complementary(base_color, extra_kwargs.get('vibrancy', 1.0))]
            elif adv_option == 'analogous':
                palette = [base_color] + list(generate_analogous(base_color, angle=30, vibrancy=extra_kwargs.get('vibrancy', 1.0)))
            elif adv_option == 'triadic':
                palette = [base_color] + list(generate_triadic(base_color, extra_kwargs.get('vibrancy', 1.0)))
            elif adv_option == 'tetradic':
                palette = generate_tetradic(base_color, extra_kwargs.get('vibrancy', 1.0))
            elif adv_option == 'monochromatic':
                palette = generate_monochromatic(base_color, num_variations=5)
            elif adv_option == 'hue':
                # Expect 'hue' in extra_kwargs; if not provided, default to 0.
                hue = extra_kwargs.get('hue', 0)
                new_base = generate_hue_choice(hue, extra_kwargs.get('vibrancy', 1.0))
                palette = [new_base] + list(generate_analogous(new_base, angle=30, vibrancy=extra_kwargs.get('vibrancy', 1.0)))
            elif adv_option == 'temperature':
                palette = generate_temperature_palette(extra_kwargs.get('temperature', 'warm'),
                                                       scheme='analogous',
                                                       vibrancy=extra_kwargs.get('vibrancy', 1.0))
            elif adv_option == 'vibrancy':
                palette = generate_vibrancy_palette(base_color, style=extra_kwargs.get('style', 'loud'))
            else:
                palette = [base_color]  # fallback
            print("\nGenerated Advanced Palette:")
        for color in palette:
            print(color)
        display_palette(palette)

    else:
        print("Invalid option selected. Exiting.")

if __name__ == '__main__':
    main()
