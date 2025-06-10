# import glob
# import os
# import json
# import shutil
# from generate_html import generate_post_html
# import datetime

# # Helper to parse dates to datetime.date objects
# def parse_date(date_val):
#     if isinstance(date_val, datetime.date):
#         return date_val
#     try:
#         # If it's already a string, parse it
#         return datetime.datetime.strptime(date_val, "%Y-%m-%d").date()
#     except Exception:
#         # Fallback to a default date
#         return datetime.date(2000, 1, 1)
    
    
# MD_DIR = "posts"
# TEMPLATE = "template.html"
# OUTPUT_DIR = "public/posts"
# IMAGES_DIR = os.path.join(MD_DIR, "media")
# INDEX_JSON = "public/index.json"
# PUBLIC_MEDIA_DIR = os.path.join("public", "media")

# def clear_and_recreate_media():
#     if os.path.exists(PUBLIC_MEDIA_DIR):
#         # print(f"Removing existing media folder: {PUBLIC_MEDIA_DIR}")
#         shutil.rmtree(PUBLIC_MEDIA_DIR)
#     # print(f"Creating media folder: {PUBLIC_MEDIA_DIR}")
#     os.makedirs(PUBLIC_MEDIA_DIR, exist_ok=True)

# def main():
#     # Recreate media folder fresh
#     clear_and_recreate_media()

#     # Get all markdown files recursively
#     md_files = glob.glob(os.path.join(MD_DIR, "**/*.md"), recursive=True)
#     # print(f"Found {len(md_files)} markdown files.")

#     # Clear index JSON if exists
#     if os.path.exists(INDEX_JSON):
#         # print(f"Removing existing index JSON: {INDEX_JSON}")
#         os.remove(INDEX_JSON)

#     posts = []
#     for md_path in md_files:
#         # print(f"Processing {md_path}")
#         metadata = generate_post_html(md_path, TEMPLATE, OUTPUT_DIR, IMAGES_DIR)
#         posts.append(metadata)

#     # Save index JSON sorted by date descending
    
# # Then when sorting:
#     posts_sorted = sorted(posts, key=lambda x: parse_date(x["date"]), reverse=True)
#     # posts_sorted = sorted(posts, key=lambda x: x["date"], reverse=True)
#     with open(INDEX_JSON, "w", encoding="utf-8") as f:
#         json.dump(posts_sorted, f, indent=2)
#     # print(f"Generated index at {INDEX_JSON}")

# if __name__ == "__main__":
#     main()
import glob
import os
import json
import shutil
from generate_html import generate_post_html
import datetime

# Helper to parse dates to datetime.date objects
def parse_date(date_val):
    if isinstance(date_val, datetime.date):
        return date_val
    try:
        # If it's already a string, parse it
        return datetime.datetime.strptime(date_val, "%Y-%m-%d").date()
    except Exception:
        # Fallback to a default date
        return datetime.date(2000, 1, 1)

# Helper to convert date objects to strings for JSON dumping
def serialize_posts(posts):
    serialized = []
    for post in posts:
        new_post = post.copy()
        dt = new_post.get("date")
        if isinstance(dt, datetime.date):
            new_post["date"] = dt.isoformat()
        serialized.append(new_post)
    return serialized

MD_DIR = "posts"
TEMPLATE = "template.html"
OUTPUT_DIR = "public/posts"
IMAGES_DIR = os.path.join(MD_DIR, "media")
INDEX_JSON = "public/index.json"
PUBLIC_MEDIA_DIR = os.path.join("public", "media")

def clear_and_recreate_media():
    if os.path.exists(PUBLIC_MEDIA_DIR):
        # print(f"Removing existing media folder: {PUBLIC_MEDIA_DIR}")
        shutil.rmtree(PUBLIC_MEDIA_DIR)
    # print(f"Creating media folder: {PUBLIC_MEDIA_DIR}")
    os.makedirs(PUBLIC_MEDIA_DIR, exist_ok=True)

def main():
    # Recreate media folder fresh
    clear_and_recreate_media()

    # Get all markdown files recursively
    md_files = glob.glob(os.path.join(MD_DIR, "**/*.md"), recursive=True)
    # print(f"Found {len(md_files)} markdown files.")

    # Clear index JSON if exists
    if os.path.exists(INDEX_JSON):
        # print(f"Removing existing index JSON: {INDEX_JSON}")
        os.remove(INDEX_JSON)

    posts = []
    for md_path in md_files:
        # print(f"Processing {md_path}")
        metadata = generate_post_html(md_path, TEMPLATE, OUTPUT_DIR, IMAGES_DIR)
        posts.append(metadata)

    # Sort posts by date descending
    posts_sorted = sorted(posts, key=lambda x: parse_date(x["date"]), reverse=True)

    # Serialize date objects to strings before JSON dump
    posts_serialized = serialize_posts(posts_sorted)

    with open(INDEX_JSON, "w", encoding="utf-8") as f:
        json.dump(posts_serialized, f, indent=2)
    # print(f"Generated index at {INDEX_JSON}")

if __name__ == "__main__":
    main()
