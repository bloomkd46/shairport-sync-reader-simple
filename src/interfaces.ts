/* 
Here are the 'ssnc' codes defined so far:

PICT -- the payload is a picture, either a JPEG or a PNG. Check the first few bytes to see which.
clip -- the payload is the IP number of the client, i.e. the sender of audio. Can be an IPv4 or an IPv6 number.
pbeg -- play stream begin. No arguments
pend -- play stream end. No arguments
pfls -- play stream flush. No arguments
prsm -- play stream resume. No arguments
pvol -- play volume. The volume is sent as a string -- "airplay_volume,volume,lowest_volume,highest_volume", where "volume", "lowest_volume" and "highest_volume" are given in dB. The "airplay_volume" is what's sent by the source (e.g. iTunes) to the player, and is from 0.00 down to -30.00, with -144.00 meaning "mute". This is linear on the volume control slider of iTunes or iOS AirPlay. If the volume setting is being ignored by Shairport Sync itself, the volume, lowest_volume and highest_volume values are zero.
prgr -- progress -- this is metadata from AirPlay consisting of RTP timestamps for the start of the current play sequence, the current play point and the end of the play sequence.
mdst -- a sequence of metadata is about to start. The RTP timestamp associated with the metadata sequence is included as data, if available.
mden -- a sequence of metadata has ended. The RTP timestamp associated with the metadata sequence is included as data, if available.
pcst -- a picture is about to be sent. The RTP timestamp associated with it is included as data, if available.
pcen -- a picture has been sent. The RTP timestamp associated with it is included as data, if available.
snam -- a device e.g. "Joe's iPhone" has started a play session. Specifically, it's the "X-Apple-Client-Name" string.
snua -- a "user agent" e.g. "iTunes/12..." has started a play session. Specifically, it's the "User-Agent" string.
stal -- this is an error message meaning that reception of a large piece of metadata, usually a large picture, has stalled; bad things may happen.
The next two two tokens are to facilitiate remote control of the source. There is some information at http://nto.github.io/AirPlay.html about remote control of the source.

daid -- this is the source's DACP-ID (if it has one -- it's not guaranteed), useful if you want to remotely control the source. Use this string to identify the source's remote control on the network.
acre -- this is the source's Active-Remote token, necessary if you want to send commands to the source's remote control (if it has one).
dapo -- the payload is the port number (as text) of the source's remote control, to which commands should be sent. It is 3689 for iTunes but varies for iOS devices.
clip -- the payload is the IP number of the client, i.e. the sender of audio. It can be an IPv4 or an IPv6 number. In AirPlay 2 operation, it is sent as soon as the client has exclusive access to the player and after any existing play session has been interrupted and terminated.
conn -- the payload is the IP number of the client, i.e. the sender of audio. Can be an IPv4 or an IPv6 number. This is an AirPlay-2-only message. It is sent as soon as the client requests access to the player. If Shairport Sync is already playing, this message is sent before the current play session is stopped.
svip -- the payload is the IP number of the server, i.e. the player itself. Can be an IPv4 or an IPv6 number.
disc -- the payload is the IP number of the client, i.e. the sender of audio. Can be an IPv4 or an IPv6 number. This is an AirPlay-2-only message. It is sent when a client has been disconnected.
*/

export interface ShairportSyncMetadata {
  /** the payload is a picture, either a JPEG or a PNG. Check the first few bytes to see which. */
  PICT: string;
  /** the payload is the IP number of the client, i.e. the sender of audio. Can be an IPv4 or an IPv6 number. */
  clip: string;
  /** play stream begin. No arguments */
  pbeg: null;
  /** play stream end. No arguments */
  pend: null;
  /** play stream flush. No arguments */
  pfls: null;
  /** play stream resume. No arguments */
  prsm: null;
  /** play volume. The volume is sent as a string -- "airplay_volume,volume,lowest_volume,highest_volume", where "volume", "lowest_volume" and "highest_volume"
   * are given in dB. The "airplay_volume" is what's sent by the source (e.g. iTunes) to the player, and is from 0.00 down to -30.00, with -144.00 meaning "mute".
   * This is linear on the volume control slider of iTunes or iOS AirPlay. If the volume setting is being ignored by Shairport Sync itself, the volume, lowest_volume and highest_volume values are zero.
   */
  pvol: {
    /** Airplay volume from 0.00 to -30.00, with -144.00 meaning "mute" */
    airplayVolume: number;
    /** Volume in dB */
    volume: number;
    /** Lowest volume in dB */
    lowestVolume: number;
    /** Highest volume in dB */
    highestVolume: number;
  };
  /** progress -- this is metadata from AirPlay consisting of RTP timestamps for the start of the current play sequence, the current play point and the end of the play sequence. */
  prgr: {
    /** RTP timestamp for the start of the current play sequence */
    start: number;
    /** RTP timestamp for the current play point */
    current: number;
    /** RTP timestamp for the end of the play sequence */
    end: number;
  };
  /** a sequence of metadata is about to start. The RTP timestamp associated with the metadata sequence
   * is included as data, if available.
   */
  mdst: number | null;
  /** a sequence of metadata has ended. The RTP timestamp associated with the metadata sequence
   * is included as data, if available.
   */
  mden: number | null;
  /** a picture is about to be sent. The RTP timestamp associated with it is included as data, if available. */
  pcst: number | null;
  /** a picture has been sent. The RTP timestamp associated with it is included as data, if available. */
  pcen: number | null;
  /** a device e.g. "Joe's iPhone" has started a play session. Specifically, it's the "X-Apple-Client-Name" string. */
  snam: string;
  /** a "user agent" e.g. "iTunes/12..." has started a play session. Specifically, it's the "User-Agent" string. */
  snua: string;
  /** this is an error message meaning that reception of a large piece of metadata, usually a large picture, has stalled; bad things may happen. */
  stal: null;
  /** this is the source's DACP-ID (if it has one -- it's not guaranteed), useful if you want to remotely control the source.
   * Use this string to identify the source's remote control on the network.
   */
  daid: string;
  /** this is the source's Active-Remote token, necessary if you want to send commands
   * to the source's remote control (if it has one).
   */
  acre: string;
  /** the payload is the port number (as text) of the source's remote control,
   * to which commands should be sent. It is 3689 for iTunes but varies
   * for iOS devices.
   */
  dapo: string;
  /** the payload is the IP number of the client, i.e. the sender of audio.
   * It can be an IPv4 or an IPv6 number. In AirPlay 2 operation, it is sent as soon as the client has exclusive access to the player
   * and after any existing play session has been interrupted and terminated.
   */
  conn: string;
  /** the payload is the IP number of the client, i.e. the sender of audio.
   * Can be an IPv4 or an IPv6 number. This is an AirPlay-2-only message.
   * It is sent as soon as the client requests access to the player.
   * If Shairport Sync is already playing, this message is sent before the current play session is stopped.
   */
  svip: string;
  /** the payload is the IP number of the server, i.e. the player itself.
   * Can be an IPv4 or an IPv6 number.
   */
  disc: string;

}
