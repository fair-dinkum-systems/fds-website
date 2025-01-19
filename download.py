import requests
import os
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import shutil

# Create images directory if it doesn't exist
image_dir = 'team_images'
os.makedirs(image_dir, exist_ok=True)

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

soup = BeautifulSoup(html_content, 'html.parser')

# Find all team member divs
team_members = soup.find_all('div', class_='team-member')

# Process each team member
for member in team_members:
    img = member.find('img')
    if img and img.get('src'):
        image_url = img['src']
        
        # Get member name to use in filename
        member_name = member.find('div', class_='member-name').text.strip()
        # Create safe filename
        safe_filename = f"{member_name.lower().replace(' ', '_')}.jpg"
        image_path = os.path.join(image_dir, safe_filename)
        
        try:
            # Download the image
            response = requests.get(image_url, stream=True)
            if response.status_code == 200:
                with open(image_path, 'wb') as f:
                    shutil.copyfileobj(response.raw, f)
                print(f"Successfully downloaded: {safe_filename}")
                
                # Update the HTML to use local image
                img['src'] = f"team_images/{safe_filename}"
            else:
                print(f"Failed to download image for {member_name}: HTTP {response.status_code}")
        except Exception as e:
            print(f"Error downloading image for {member_name}: {str(e)}")

# Write the modified HTML
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

print("\nProcess completed. Check the team_images directory for downloaded images.")
print("Updated HTML has been saved to index.html")