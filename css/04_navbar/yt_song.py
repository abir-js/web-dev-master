import pywhatkit

try:
    song = input("Enter song name : ")
    pywhatkit.playonyt(song)

    print("successfully played")

except:
    print("error")