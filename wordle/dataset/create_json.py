# import sys
# import json

# words = open(sys.argv[1])
# word_list = words.readlines()
# json_words = {word.rstrip(): "1" for word in word_list}

# print(json.dumps(json_words, indent=4))


import sys
import json

# Open the file provided as the first command line argument
with open(sys.argv[1], 'r') as file:
    # Read all lines and strip any leading/trailing whitespace characters
    word_list = [line.strip() for line in file]

# Create a dictionary with 'words' as the key and word_list as the value
json_words = {"words": word_list}

# Convert the dictionary to a JSON formatted string and print
print(json.dumps(json_words, indent=4))
