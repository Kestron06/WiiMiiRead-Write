# Use https://github.com/SMOMusic/MiiJS instead

# WiiMiiRead/Write
This is still being worked on and as such isn't setup in a super useful way, but what this allows you to do is put a Wii's Mii file on your device (Put the Mii file on the Wiimote, and then you can connect the Wiimote using Wiimotehook (what I used) or connect it through Dolphin Wii Emulator and then I used WDML_MiiTransfer to get it onto my device. You can also do the same to write a Mii to your Wii). From there, you can use Node.js with index.js to read the file into a human-readable JSON object. Currently I do not have arguments at the command line level set up so you will have to edit the index.js file to say which file you would like to read, and how you want it outputted. I just do `console.log(readMiiBinaryFile('./PATHTOMIIFILE.mii'));`. I will be working on this more until it is a usable application with more features, but considering the time and research it took to get this far I decided I'd document it.

The outputted JSON file should hopefully be very human-readable, it is for me but I'm also a programmer with a different mindset. The syntax for paginated ones (such as Mii.mouth.type) is PageNumber-X-Y, so 123 would be first page, second from the right, third from the top.

For other things such as beard type where it isn't paginated and it gives you a number, it is in programmer array notation - meaning you start counting at 0. So the nose in the top right corner, you count 0, 1, 2 - the two dot nostrils would be a 2

Writing works on whatever path you set it to go to, and write ./MII NAME.mii which can then be transferred. Note that System ID and Mii ID are not handled, so for right now I recommend not messing with this (if you want to, spoof 0x18 to 0x1F from a Mii originating from your Wii). This will be resolved soon.


Dependencies: fs. That's it - `npm i fs` from a command line in the same folder as the program and you're good to go.

# MakeSpecial.js
IS NOT TESTED. IT WILL MOST LIKELY NOT WORK.
I am pinging it up to the repo because of some issues I'm having with my laptop. It MIGHT work, but it most likely won't. I haven't tested.

# 3DSRead.js
Is fully working however it's a lot more complex with a bunch more dependencies - I'm still tinkering with it as well and don't have a ton of test cases done. When I do, I'll rename the repo to encompass the 3DS as well.

# Contact
While I believe it is fully functioning, I obviously cannot test every single Mii combination and also have not worked with Binary before. If you find anything wrong, please let me know! You can reach me at kestron@kestron.software, or making an issue, or joining https://discord.gg/k3yVkrrvez
