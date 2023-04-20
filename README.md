# WiiMiiReader
This is still being worked on and as such isn't setup in a super useful way, but what this allows you to do is put a Wii's Mii file on your device (Put the Mii file on the Wiimote, and then you can connect the Wiimote using Wiimotehook (what I used) or connect it through Dolphin Wii Emulator and then I used WDML_MiiTransfer to get it onto my device). From there, you can use Node.js with index.js to read the file into a human-readable JSON object. Currently I do not have arguments at the command line level set up so you will have to edit the index.js file to say which file you would like to read, and how you want it outputted. I just do `console.log(readMiiBinaryFile('./PATHTOMIIFILE.mii'));`. I will be working on this more until it is a usable application with more features, but considering the time and research it took to get this far I decided I'd document it.

The outputted JSON file should hopefully be very human-readable, it is for me but I'm also a programmer with a different mindset. The syntax for paginated ones (such as Mii.mouth.type) is PageNumber-X-Y, so 123 would be first page, second from the right, third from the top.

For other things such as beard type where it isn't paginated and it gives you a number, it is in programmer array notation - meaning you start counting at 0. So the nose in the top right corner, you count 0, 1, 2 - the two dot nostrils would be a 2


Dependencies: fs. That's it - `npm i fs` from a command line in the same folder as the program and you're good to go.

Also while I believe it is fully functioning, I obviously cannot test every single Mii combination and also have not worked with Binary before. If you find anything wrong, please let me know! You can reach me at kestron@kestron.software, or making an issue, or joining https://discord.gg/k3yVkrrvez
