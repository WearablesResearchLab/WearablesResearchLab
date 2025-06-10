
    
def generate_post_html(md_path, template_path, output_dir, images_dir):
    import os
    import shutil
    import markdown
    import yaml
    from bs4 import BeautifulSoup
    import traceback
    import re

    # print(f"Starting generate_post_html for: {md_path}")
    try:
        with open(md_path, "r", encoding="utf-8") as f:
            content = f.read()
        # print("Markdown file read successfully")

        # Extract frontmatter
        if content.startswith("---"):
            parts = content.split("---", 2)
            front = yaml.safe_load(parts[1])
            body = parts[2]
            # print(f"Frontmatter extracted: {front}")
        else:
            front = {}
            body = content
            # print("No frontmatter found")

        # Preprocess Obsidian image links to standard markdown
        import re
        body = re.sub(r'!\[\[(.+?)\]\]', r'![](media/\1)', body)
        
        # Preprocess Obsidian regular links
        def replace_obsidian_links(match):
            link = match.group(1)
            if link.endswith('.md'):
                link = link[:-3]
            return f'[{link}]({link}.html)'

        body = re.sub(r'\[\[(.+?)\]\]', replace_obsidian_links, body)

        # Convert markdown to HTML
        html = markdown.markdown(body, extensions=["extra", "codehilite", "toc"])
        # print("Markdown converted to HTML")

        soup = BeautifulSoup(html, "html.parser")

        # Fix image paths and copy images
        for img in soup.find_all("img"):
            src = img.get("src", "")
            # print(f"Found image src: {src}")
            if src and not src.startswith("http"):
                img_name = os.path.basename(src)
                new_src = f"media/{img_name}"
                img["src"] = new_src
                media_dir = os.path.join(output_dir, "media")
                os.makedirs(media_dir, exist_ok=True)
                src_path = os.path.join(images_dir, img_name)
                dest_path = os.path.join(media_dir, img_name)
                # print(f"Copying image from {src_path} to {dest_path}")
                shutil.copy2(src_path, dest_path)

        # Load template
        with open(template_path, "r", encoding="utf-8") as f:
            template = f.read()
        # print(f"Template loaded from {template_path}")

       # Replace placeholders
        date_val = front.get("date", "2000-01-01")
        if hasattr(date_val, "isoformat"):
            date_str = date_val.isoformat()
        else:
            date_str = str(date_val)

        full_html = template.replace("{{ content }}", str(soup))
        full_html = full_html.replace("{{ title }}", front.get("title", os.path.splitext(os.path.basename(md_path))[0]))
        full_html = full_html.replace("{{ date }}", date_str)


        # full_html = full_html.replace("{{ date }}", front.get("date", "2000-01-01"))
        # print("Placeholders replaced")

        # Write output file
        name = os.path.splitext(os.path.basename(md_path))[0]
        html_path = os.path.join(output_dir, f"{name}.html")
        # print(f"Writing HTML output to {html_path}")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(full_html)

        # print(f"Built {html_path}")

        return {
            "title": front.get("title", name),
            "date": front.get("date", "2000-01-01"),
            "description": front.get("description", ""),
            "url": f"{name}.html"
        }

    except Exception as e:
        # print(f"Error in generate_post_html for {md_path}: {e}")
        traceback.print_exc()
        raise
