import axios from "axios";
const libraryUrl = 'https://api.spotify.com/v1/me/tracks';
const idUrl = 'https://api.spotify.com/v1/audio-features?ids='
const artistUrl = 'https://api.spotify.com/v1/artists?ids='

export const getUsersLikedSongs = async(token, count) => {
    const header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
    var json = [];
    var off = 0;
    while (off < count) {
        let response = await axios.get(libraryUrl, { headers: header, params: { offset: off, limit: 50 } });
        let tracks = response.data.items;
        let idStr = '';
        tracks.forEach(function(entry) {
            idStr += entry.track.id + ',';
        });
        idStr = idStr.slice(0, -1)
        let artistStr = '';
        tracks.forEach(entry => {
            artistStr += entry.track.artists[0].id + ",";
        })
        artistStr = artistStr.slice(0, -1);
        response = await axios.get(idUrl + idStr, { headers: header, params: idStr });
        let features = response.data.audio_features;
        response = await axios.get(artistUrl + artistStr, { headers: header, params: artistStr });
        let artists = response.data.artists;
        for (let i = 0; i < 50; i++) {
            if (features[i]) {
                let currArtist = {};
                let currEntry = {};
                let currFeatures = {};
                currArtist['followers'] = artists[i].followers.total;
                currArtist['genres'] = artists[i].genres;
                currArtist['main_artist'] = artists[i].name;
                let artistArr = [];
                tracks[i].track.artists.forEach(entry => {
                    artistArr.push(entry.name)
                })
                currArtist['featured_artists'] = artistArr;
                currArtist['popularity'] = artists[i].popularity;
                currArtist['images'] = artists[i].images;
                currFeatures['danceability'] = features[i].danceability;
                currFeatures['energy'] = features[i].energy;
                currFeatures['key'] = features[i].key;
                currFeatures['loudness'] = features[i].loudness;
                currFeatures['mode'] = features[i].mode;
                currFeatures['speechiness'] = features[i].speechiness;
                currFeatures['acousticness'] = features[i].acousticness;
                currFeatures['instrumentalness'] = features[i].instrumentalness;
                currFeatures['liveness'] = features[i].liveness;
                currFeatures['valence'] = features[i].valence;
                currFeatures['tempo'] = features[i].tempo;
                currFeatures['time_signature'] = features[i].time_signature;
                currEntry['name'] = tracks[i].track.name;
                currEntry['added_at'] = tracks[i].added_at;
                currEntry['release_date'] = tracks[i].track.album.release_date;
                currEntry['artist'] = tracks[i].track.artists[0].name;
                currEntry['duration'] = tracks[i].track.duration_ms;
                currEntry['explicit'] = tracks[i].track.explicit;
                currEntry['popularity'] = tracks[i].track.popularity;
                currEntry['image_link'] = tracks[i].track.album.images[0].url;
                currEntry['song_popularity'] = tracks[i].track.popularity;
                currEntry['id'] = tracks[i].track.id;
                currEntry['preview_url'] = tracks[i].track.preview_url;
                currEntry['features'] = currFeatures;
                currEntry['artist_info'] = currArtist;
                json.push(currEntry);
            }
        }
        off += 50;
    }
    return json;
}