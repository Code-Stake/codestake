import re


# open a file
f = open("reverse-linkedlist/something.py", "r")

with open("reverse-linkedlist/something.py", "r") as f:
    fileContent = f.read()
    
    


# Define the section name
sectionName = "section2"

# Define the regular expression to match the section content
sectionRegex = r'#\s*<' + sectionName + r'>\n(.*?)\n#\s*</' + sectionName + r'>'

# Extract the section content
sectionContent = re.findall(sectionRegex, fileContent, re.DOTALL)[0].strip()

# Output the section content
print(sectionContent)