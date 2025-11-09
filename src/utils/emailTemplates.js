/**
 * Email Templates for Event Management
 */

function getRegistrationConfirmationTemplate(eventDetails, bookingDetails) {
  const { Title, Date, Location, eventType, Organizer } = eventDetails;
  const { FirstName, LastName, registrationType } = bookingDetails;

  const registrationTypeText =
    registrationType === "Volunteer"
      ? "volunteer registration"
      : registrationType === "Sponsor"
      ? "sponsorship registration"
      : "registration";

  return {
    subject: `Registration Confirmed: ${Title}`,
    text: `
Hello ${FirstName} ${LastName},

Thank you for your ${registrationTypeText} for ${Title}!

Event Details:
- Event: ${Title}
- Organizer: ${Organizer || "N/A"}
- Date: ${Array.isArray(Date) ? Date.join(", ") : Date || "TBA"}
- Location: ${Array.isArray(Location) ? Location.join(", ") : Location}
- Type: ${eventType}

We look forward to seeing you at the event!

Best regards,
${Organizer || "Event Team"}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Registration Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${FirstName} ${LastName}</strong>,</p>
      <p>Thank you for your <strong>${registrationTypeText}</strong> for <strong>${Title}</strong>!</p>
      
      <div class="details">
        <h3>Event Details:</h3>
        <p><strong>Event:</strong> ${Title}</p>
        <p><strong>Organizer:</strong> ${Organizer || "N/A"}</p>
        <p><strong>Date:</strong> ${Array.isArray(Date) ? Date.join(", ") : Date || "TBA"}</p>
        <p><strong>Location:</strong> ${Array.isArray(Location) ? Location.join(", ") : Location}</p>
        <p><strong>Type:</strong> ${eventType}</p>
      </div>
      
      <p>We look forward to seeing you at the event!</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>${Organizer || "Event Team"}</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };
}

function getBroadcastTemplate(eventTitle, subject, message, organizer) {
  return {
    subject: `${eventTitle}: ${subject}`,
    text: `
${message}

---
This message is regarding: ${eventTitle}
From: ${organizer || "Event Team"}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .message { background-color: white; padding: 20px; margin: 15px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>${eventTitle}</h2>
      <h3>${subject}</h3>
    </div>
    <div class="content">
      <div class="message">
        ${message.replace(/\n/g, "<br>")}
      </div>
    </div>
    <div class="footer">
      <p>From: ${organizer || "Event Team"}</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };
}

function getEventUpdateTemplate(eventTitle, updateMessage, organizer) {
  return {
    subject: `Event Update: ${eventTitle}`,
    text: `
Event Update for ${eventTitle}

${updateMessage}

---
From: ${organizer || "Event Team"}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .update { background-color: white; padding: 20px; margin: 15px 0; border-left: 4px solid #FF9800; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Event Update</h2>
      <h3>${eventTitle}</h3>
    </div>
    <div class="content">
      <div class="update">
        ${updateMessage.replace(/\n/g, "<br>")}
      </div>
    </div>
    <div class="footer">
      <p>From: ${organizer || "Event Team"}</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };
}

function getVolunteerConfirmationTemplate(eventDetails, bookingDetails) {
  const { Title, Date, Location, Organizer } = eventDetails;
  const { FirstName, LastName } = bookingDetails;

  return {
    subject: `Volunteer Registration Confirmed: ${Title}`,
    text: `
Hello ${FirstName} ${LastName},

Thank you for volunteering for ${Title}!

Your commitment to help makes this event possible. We truly appreciate your support.

Event Details:
- Event: ${Title}
- Organizer: ${Organizer || "N/A"}
- Date: ${Array.isArray(Date) ? Date.join(", ") : Date || "TBA"}
- Location: ${Array.isArray(Location) ? Location.join(", ") : Location}

We will send you more details about your volunteer role soon.

Thank you for your generosity!

Best regards,
${Organizer || "Event Team"}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #9C27B0; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #9C27B0; }
    .thank-you { background-color: #E1BEE7; padding: 15px; margin: 15px 0; text-align: center; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank You for Volunteering!</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${FirstName} ${LastName}</strong>,</p>
      
      <div class="thank-you">
        <h3>Your commitment to help makes this event possible!</h3>
      </div>
      
      <p>Thank you for volunteering for <strong>${Title}</strong>.</p>
      
      <div class="details">
        <h3>Event Details:</h3>
        <p><strong>Event:</strong> ${Title}</p>
        <p><strong>Organizer:</strong> ${Organizer || "N/A"}</p>
        <p><strong>Date:</strong> ${Array.isArray(Date) ? Date.join(", ") : Date || "TBA"}</p>
        <p><strong>Location:</strong> ${Array.isArray(Location) ? Location.join(", ") : Location}</p>
      </div>
      
      <p>We will send you more details about your volunteer role soon.</p>
      <p><strong>Thank you for your generosity!</strong></p>
    </div>
    <div class="footer">
      <p>Best regards,<br>${Organizer || "Event Team"}</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };
}

function getTourConfirmationTemplate(tourDetails, bookingDetails) {
  const { title, date, time, meetingPoint, mapLink } = tourDetails;
  const { fullName, numberOfTickets, ticketId, qrCode } = bookingDetails;

  return {
    subject: `Tour Booking Confirmed: ${title}`,
    text: `
Hello ${fullName},

Your tour booking has been confirmed!

Tour Details:
- Tour: ${title}
- Date: ${date}
- Time: ${time || "TBA"}
- Meeting Point: ${meetingPoint}
- Number of Tickets: ${numberOfTickets}
- Ticket ID: ${ticketId}

${mapLink ? `Location: ${mapLink}` : ""}

Please present your ticket ID or QR code at the meeting point.

See you there!

Best regards,
CBAAC Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #FF5722; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #FF5722; }
    .qr-code { text-align: center; margin: 20px 0; }
    .qr-code img { max-width: 200px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Tour Booking Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Your tour booking has been confirmed!</p>
      
      <div class="details">
        <h3>Tour Details:</h3>
        <p><strong>Tour:</strong> ${title}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time || "TBA"}</p>
        <p><strong>Meeting Point:</strong> ${meetingPoint}</p>
        <p><strong>Number of Tickets:</strong> ${numberOfTickets}</p>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        ${mapLink ? `<p><strong>Location:</strong> <a href="${mapLink}">View on Map</a></p>` : ""}
      </div>
      
      ${qrCode ? `
      <div class="qr-code">
        <h3>Your QR Code:</h3>
        <img src="${qrCode}" alt="QR Code" />
        <p>Please present this QR code at the meeting point</p>
      </div>
      ` : ""}
      
      <p>See you there!</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>CBAAC Team</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };
}

function getTripConfirmationTemplate(tripDetails, bookingDetails) {
  const { title, destination, startDate, endDate, itinerary, mapLink } = tripDetails;
  const { fullName, numberOfTickets, ticketId, qrCode } = bookingDetails;

  const itineraryHTML = itinerary && itinerary.length > 0
    ? itinerary.map(day => `
        <div style="margin: 10px 0; padding: 10px; background: #f5f5f5;">
          <strong>Day ${day.day}: ${day.title}</strong>
          <p>${day.description}</p>
          ${day.activities ? `<p><em>Activities: ${day.activities.join(", ")}</em></p>` : ""}
        </div>
      `).join("")
    : "<p>Itinerary will be shared soon.</p>";

  return {
    subject: `Trip Booking Confirmed: ${title}`,
    text: `
Hello ${fullName},

Your trip booking has been confirmed!

Trip Details:
- Trip: ${title}
- Destination: ${destination}
- Start Date: ${startDate}
- End Date: ${endDate}
- Number of Tickets: ${numberOfTickets}
- Ticket ID: ${ticketId}

${mapLink ? `Location: ${mapLink}` : ""}

We will send you more details about the trip soon.

Best regards,
CBAAC Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #00BCD4; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #00BCD4; }
    .itinerary { background-color: white; padding: 15px; margin: 15px 0; }
    .qr-code { text-align: center; margin: 20px 0; }
    .qr-code img { max-width: 200px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Trip Booking Confirmed!</h1>
    </div>
    <div class="content">
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Your trip booking has been confirmed!</p>
      
      <div class="details">
        <h3>Trip Details:</h3>
        <p><strong>Trip:</strong> ${title}</p>
        <p><strong>Destination:</strong> ${destination}</p>
        <p><strong>Start Date:</strong> ${startDate}</p>
        <p><strong>End Date:</strong> ${endDate}</p>
        <p><strong>Number of Tickets:</strong> ${numberOfTickets}</p>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        ${mapLink ? `<p><strong>Location:</strong> <a href="${mapLink}">View on Map</a></p>` : ""}
      </div>
      
      <div class="itinerary">
        <h3>Itinerary:</h3>
        ${itineraryHTML}
      </div>
      
      ${qrCode ? `
      <div class="qr-code">
        <h3>Your QR Code:</h3>
        <img src="${qrCode}" alt="QR Code" />
        <p>Please keep this QR code for check-in</p>
      </div>
      ` : ""}
      
      <p>We will send you more details about the trip soon.</p>
    </div>
    <div class="footer">
      <p>Best regards,<br>CBAAC Team</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  };
}

module.exports = {
  getRegistrationConfirmationTemplate,
  getBroadcastTemplate,
  getEventUpdateTemplate,
  getVolunteerConfirmationTemplate,
  getTourConfirmationTemplate,
  getTripConfirmationTemplate,
};
