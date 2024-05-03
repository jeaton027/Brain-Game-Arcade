import sys

def extract_and_save_four_letter_words(word_length, input_file_path, output_file_path):
	# Create an empty list to store 4-letter words
	_letter_words = []
	
	# Open the input file and read lines
	with open(input_file_path, 'r') as file:
		for word in file:
			# Strip whitespace and newlines
			word = word.strip()
			# Check if the word has exactly 4 letters
			if len(word) == word_length:
				_letter_words.append(word)

	# Sort the list of 4-letter words
	_letter_words.sort()

	# Write the sorted 4-letter words to a new file
	with open(output_file_path, 'w') as file:
		for word in _letter_words:
			file.write(word + '\n')

if __name__ == "__main__":
	if len(sys.argv) < 2:
		print("Usage: python3 script_name.py word-length <path_to_dictionary_file> new_file_name.txt")
		sys.exit(1)

	word_length = int(sys.argv[1])
	input_file_path = sys.argv[2]
	output_file_path = sys.argv[3]
	extract_and_save_four_letter_words(word_length, input_file_path, output_file_path)
