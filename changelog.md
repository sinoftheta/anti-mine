# Change Log

## Alpha 0.2.3 - 12/17/2019
### Changes
- Solved mines and solved mine islands are now automatically revealed.

### Additions
- Game now capable of using predetermined mine positions

## Alpha 0.2.2 - 12/14/2019
### Changes
- Updated tile uncover logic. Adjacent tiles with values between 0 and the origin tile are uncovered.
- Readme links Glossary, How To Play, and Changelog

### Known Issues
- In rare cases, it is possible to spawn two Tile Select Cursors
- Game playable with menu open
- Various menu issues

## Alpha 0.2.1 - 12/14/2019
### Changes
- Fixed issue where game does not register win when playing a game with a preset number of mines
- Play again button gains focus when game ends
- Removed black and white color scheme
### Additions
- Added How To Play document
- Added keyboard controls 

### Known Issues
- Game playable with menu open
- Various menu issues

## Alpha 0.2 - 12/13/2019
### Changes
- Improved color mapping
- Chnged color schemes
- Updated kernel to be 15x15
- Updated webpage style
- Mines are now revealed on win

### Additions
- Added menu
- Added new win/lose message
- Added glossary

### Known Issues
- Game playable with menu open
- Various menu issues
- Game does not register win when playing a game with a preset number of mines


## Alpha 0.1 - 12/5/2019
### Changes
- Updated tile uncovering mechanics. Revealing a tile with a positive value will not automatically reveal tiles with a negative value and vice-versa
- Mines will automatically be visually uncovered when they are surrounded by uncovered tiles, or "solved"
- Updated Readme

### Additions
- Added Changelog

### Known Issues
- More tiles will be revealed than expected when the first click is a non-zero value tile
- Solved mines that neighbor other mines are not automatically revealed
