// src/app/components/_megaData.ts

// Static data for Sports, Concerts, Theater
export const sportsData: Record<string, string[]> = {
  NBA: [
    'Atlanta Hawks','Boston Celtics','Brooklyn Nets','Charlotte Hornets',
    'Chicago Bulls','Cleveland Cavaliers','Dallas Mavericks','Denver Nuggets',
    'Detroit Pistons','Golden State Warriors','Houston Rockets','Indiana Pacers',
    'LA Clippers','Los Angeles Lakers','Memphis Grizzlies','Miami Heat',
    'Milwaukee Bucks','Minnesota Timberwolves','New Orleans Pelicans','New York Knicks',
    'Oklahoma City Thunder','Orlando Magic','Philadelphia 76ers','Phoenix Suns',
    'Portland Trail Blazers','Sacramento Kings','San Antonio Spurs','Toronto Raptors',
    'Utah Jazz','Washington Wizards'
  ],
  MLB: ['…your MLB teams…'],
  NFL: ['…your NFL teams…'],
  CFB: ['…'],
  MLS: ['…'],
  NHL: ['…'],
  Other: ['…']
};

export const concertData: Record<string, string[]> = {
  'All Artists': [
    'Coldplay','The Weeknd','The Eagles','Billie Eilish','Sleep Token',
    'Marco Antonio Solís','Beyoncé','Oasis','Stray Kids','David Byrne',
    'Morgan Wallen','Shakira','Post Malone','Metallica','Lady Gaga',
    'Tate McRae','Benson Boone','Mumford & Sons','Kendrick Lamar','Zach Bryan',
    'Kenny Chesney','Chris Brown','Chris Stapleton','Backstreet Boys','Riley Green',
    'Dave Matthews Band','Wu-Tang Clan'
  ]
};

export const theaterData: Record<string, string[]> = {
  'All Shows': [
    'The Sphere Experience','Hamilton','Wizard Of Oz At Sphere','Andrea Bocelli',
    'Nate Bargatze','Kevin Bridges','Les Misérables','Wicked','Lion King',
    'Radio City Christmas Spectacular','Jo Koy','Harry Potter And The Cursed Child',
    'Book Of Mormon','Beauty And The Beast','Shane Gillis','A Beautiful Noise',
    'Matt Rife','Phantom Of The Opera','Oh Mary','Outsiders','Cirque Du Soleil Ovo',
    'Rick Mercer','MJ - The Musical','John Mulaney','Maybe Happy Ending'
  ]
};
