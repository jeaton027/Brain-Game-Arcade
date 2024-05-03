import os
import sys
import json

def create_json(directory):
    data = []
    for filename in os.listdir(directory):
        if os.path.isfile(os.path.join(directory, filename)):
            file_path = os.path.join(directory, filename)
            name, extension = os.path.splitext(filename)
            data.append({"image": file_path, "name": name})

    with open(os.path.join(directory, "cards.json"), "w") as f:
        json.dump(data, f, indent=4)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <directory_path>")
        sys.exit(1)
    
    directory_path = sys.argv[1]
    if not os.path.isdir(directory_path):
        print("Error: Directory not found.")
        sys.exit(1)
    
    create_json(directory_path)
