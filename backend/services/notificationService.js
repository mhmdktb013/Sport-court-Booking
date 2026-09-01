/**
 * Notification Service (Architecture-ready for WhatsApp Cloud API)
 *
 * NOTE: As per Phase 8 specification, live Meta / WhatsApp API calls are NOT enabled yet.
 * This service structures message payloads, logs events, and provides clean hooks
 * ready to plug into WhatsApp Cloud API in the final phase.
 */

class NotificationService {
  /**
   * Format message payload for booking confirmation
   */
  formatConfirmationMessage(booking) {
    return `🎉 *Booking Confirmed!*
━━━━━━━━━━━━━━━━━━━
🏟️ *Court:* ${booking.courtName}
⚽ *Sport:* ${booking.sportType.toUpperCase()}
📅 *Date:* ${booking.date}
⏰ *Time:* ${booking.startTime} - ${booking.endTime} (${booking.duration} mins)
💵 *Total Price:* $${booking.price}
🔖 *Booking ID:* #${booking.bookingId}
👤 *Name:* ${booking.customerName}
━━━━━━━━━━━━━━━━━━━
📍 *Location:* SportsZone Main Arena, Complex Road
ℹ️ Please arrive 10 minutes prior to your slot. Enjoy your game!`;
  }

  /**
   * Format message payload for booking reminder
   */
  formatReminderMessage(booking) {
    return `⏰ *Upcoming Game Reminder!*
━━━━━━━━━━━━━━━━━━━
Your booking for *${booking.courtName}* is coming up today:
📅 *Date:* ${booking.date}
⏰ *Time:* ${booking.startTime} - ${booking.endTime}
🔖 *Booking ID:* #${booking.bookingId}
See you on the court!`;
  }

  /**
   * Format cancellation message
   */
  formatCancellationMessage(booking, reason = '') {
    return `❌ *Booking Cancelled*
━━━━━━━━━━━━━━━━━━━
Your booking #${booking.bookingId} for *${booking.courtName}* on ${booking.date} at ${booking.startTime} has been cancelled.
${reason ? `Reason: ${reason}` : ''}
For assistance, contact our support team.`;
  }

  /**
   * Hook called when a booking is successfully confirmed
   */
  async onBookingConfirmed(booking) {
    const formatted = this.formatConfirmationMessage(booking);
    console.log(`[Notification Hook: Booking Confirmed] To: ${booking.customerPhone}\n${formatted}`);
    // Prepared for WhatsApp Cloud API integration in final phase
    return { success: true, queued: true, type: 'CONFIRMATION' };
  }

  /**
   * Hook called when a booking is cancelled
   */
  async onBookingCancelled(booking, reason) {
    const formatted = this.formatCancellationMessage(booking, reason);
    console.log(`[Notification Hook: Booking Cancelled] To: ${booking.customerPhone}\n${formatted}`);
    return { success: true, queued: true, type: 'CANCELLATION' };
  }

  /**
   * Send OTP verification code
   */
  async sendOtp(phone, code) {
    console.log(`[OTP Hook: Phone Verification] Phone: ${phone} | Code: [ ${code} ]`);
    return { success: true, code };
  }
}

const notificationService = new NotificationService();
export default notificationService;
