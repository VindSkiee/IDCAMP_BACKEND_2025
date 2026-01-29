class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());

      console.log(`Processing export request for playlist ${playlistId} to ${targetEmail}`);

      const playlist = await this._playlistsService.getPlaylistForExport(playlistId);

      if (!playlist) {
        throw new Error(`Playlist with id ${playlistId} not found`);
      }

      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify(playlist),
      );

      console.log(`Email sent successfully to ${targetEmail}:`, result.messageId);
    } catch (error) {
      console.error('Error processing export message:', {
        error: error.message,
        stack: error.stack,
      });
    }
  }
}

export default Listener;
