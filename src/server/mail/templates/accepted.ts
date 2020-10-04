import escape from 'escape-html';
import { UserDbInterface } from '../../generated/graphql';

// TODO: Dedupe these emails. All the HTML is the same, the only difference is in the
// actual lines presented to the user, which could be parameterized. Rich HTML content
// (links only so far) could be tricky if we want to re-use the same HTML for text and
// HTML sections.

export default (user: UserDbInterface): AWS.SES.SendEmailRequest => ({
	Destination: {
		ToAddresses: [user.email], // Email address/addresses that you want to send your email
	},
	Message: {
		Body: {
			Html: {
				// HTML Format of the email
				Charset: 'UTF-8',
				Data: `<!doctype html>
				<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
				
				<head>
					<title> You've Been Accepted! </title>
					<!--[if !mso]><!-- -->
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					<!--<![endif]-->
					<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1">
					<style type="text/css">
						#outlook a {
							padding: 0;
						}
				
						.ReadMsgBody {
							width: 100%;
						}
				
						.ExternalClass {
							width: 100%;
						}
				
						.ExternalClass * {
							line-height: 100%;
						}
				
						body {
							margin: 0;
							padding: 0;
							-webkit-text-size-adjust: 100%;
							-ms-text-size-adjust: 100%;
						}
				
						table,
						td {
							border-collapse: collapse;
							mso-table-lspace: 0pt;
							mso-table-rspace: 0pt;
						}
				
						img {
							border: 0;
							height: auto;
							line-height: 100%;
							outline: none;
							text-decoration: none;
							-ms-interpolation-mode: bicubic;
						}
				
						p {
							display: block;
							margin: 13px 0;
						}
					</style>
					<!--[if !mso]><!-->
					<style type="text/css">
						@media only screen and (max-width:480px) {
							@-ms-viewport {
								width: 320px;
							}
							@viewport {
								width: 320px;
							}
						}
					</style>
					<!--<![endif]-->
					<!--[if mso]>
								<xml>
								<o:OfficeDocumentSettings>
									<o:AllowPNG/>
									<o:PixelsPerInch>96</o:PixelsPerInch>
								</o:OfficeDocumentSettings>
								</xml>
								<![endif]-->
					<!--[if lte mso 11]>
								<style type="text/css">
									.outlook-group-fix { width:100% !important; }
								</style>
								<![endif]-->
					<style type="text/css">
						@media only screen and (min-width:480px) {
							.mj-column-per-100 {
								width: 100% !important;
								max-width: 100%;
							}
						}
					</style>
					<style type="text/css">
						@media only screen and (max-width:480px) {
							table.full-width-mobile {
								width: 100% !important;
							}
							td.full-width-mobile {
								width: auto !important;
							}
						}
					</style>
				</head>
				
				<body style="background-color:#E7E7E7;">
					<div style="background-color:#E7E7E7;">
						<!--[if mso | IE]>
							<table
								 align="center" border="0" cellpadding="0" cellspacing="0" class="hide_on_mobile-outlook" style="width:600px;" width="600"
							>
								<tr>
									<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
							<![endif]-->
						<div class="hide_on_mobile" style="Margin:0px auto;max-width:600px;">
							<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
								<tbody>
									<tr>
										<td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
											<!--[if mso | IE]>
													<table role="presentation" border="0" cellpadding="0" cellspacing="0">
												
								<tr>
							
								</tr>
							
													</table>
												<![endif]-->
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<!--[if mso | IE]>
									</td>
								</tr>
							</table>
							
							<table
								 align="center" border="0" cellpadding="0" cellspacing="0" class="body-section-outlook" style="width:600px;" width="600"
							>
								<tr>
									<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
							<![endif]-->
						<div class="body-section" style="-webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); background: #ffffff; background-color: #ffffff; Margin: 0px auto; border-radius: 8px; max-width: 600px;">
							<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:8px;">
								<tbody>
									<tr>
										<td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
											<!--[if mso | IE]>
													<table role="presentation" border="0" cellpadding="0" cellspacing="0">
												
										<tr>
											<td
												 class="" width="600px"
											>
									
							<table
								 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
							>
								<tr>
									<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
							<![endif]-->
											<div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;max-width:600px;">
												<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
													<tbody>
														<tr>
															<td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:40px;padding-right:40px;text-align:center;vertical-align:top;">
																<!--[if mso | IE]>
													<table role="presentation" border="0" cellpadding="0" cellspacing="0">
												
								<tr>
							
										<td
											 class="" style="vertical-align:top;width:520px;"
										>
									<![endif]-->
																<div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
																		<tr>
																			<td align="center" style="font-size:0px;padding:0;word-break:break-word;">
																				<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
																					<tbody>
																						<tr>
																							<td style="width:520px;"> <center><a href="https://vandyhacks.org" target="_blank">
									
							<img alt="" height="auto" src="https://storage.googleapis.com/vh-fall-2020-assets/VH_Pixel_Logo.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:30%;" width="520">
						
								</a> </center></td>
																						</tr>
																					</tbody>
																				</table>
																			</td>
																		</tr>
																	</table>
																</div>
																<!--[if mso | IE]>
										</td>
									
								</tr>
							
													</table>
												<![endif]-->
															</td>
														</tr>
													</tbody>
												</table>
											</div>
											<!--[if mso | IE]>
									</td>
								</tr>
							</table>
							
											</td>
										</tr>
									
										<tr>
											<td
												 class="" width="600px"
											>
									
							<table
								 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
							>
								<tr>
									<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
							<![endif]-->
											<div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;border-radius:8px;max-width:600px;">
												<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;border-radius:8px;">
													<tbody>
														<tr>
															<td style="direction:ltr;font-size:0px;padding:20px 0;padding-left:15px;padding-right:15px;text-align:center;vertical-align:top;">
																<!--[if mso | IE]>
													<table role="presentation" border="0" cellpadding="0" cellspacing="0">
												
								<tr>
							
										<td
											 class="" style="vertical-align:top;width:570px;"
										>
									<![endif]-->
																<div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
																		<tr>
																			<td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																				<div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;"> Hi ${escape(
																					user.preferredName || user.firstName
																				)}! </div>
																			</td>
																		</tr>
																		<tr>
																			<td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																				<div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;"> 
																				Congratulations! You’re invited to be a part of <b>VandyHacks VII: Retro Edition</b>! We enjoyed reading your application and would love to see your ideas come to life during our virtual event on <b>October 2nd-4th</b>! 
																				</div>
																			</td>
																		</tr>
																		<tr>
																			<td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																				<div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;"> 
																					Head over to the application portal <a href="https://apply.vandyhacks.org">here</a> and confirm your attendance by October 2nd, 12:00 PM CDT.
																					<b>Make sure you’ve read and checked “agree” to our hackathon waiver</b> under the hacker application. 
																				</div>
																			</td>
																		</tr>
																		<tr>
																<td
																	align="left"
																	style="font-size:0px;padding:10px 25px;word-break:break-word;"
																>
																	<div
																		style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;"
																	>
																		Finally, please make sure to do the following in preparation for
																		the event:
																		<ul>
																			<li>
																				<b
																					>Join our Discord
																					<a href="https://discord.gg/MbbfBWW">here</a></b
																				>
																				for communication before, during, and after the hackathon!
																			</li>
																			<li>
																				<b
																					>Review the full hackathon schedule
																					<a href="https://vandyhacks.org/">here!</a></b
																				>
																			</li>
																			<li style="list-style: none;">
																				*NOTE: We will be baking nutella hand pies at 5:00 PM CDT
																				on Saturday, October 3rd, so get your <a href="https://docs.google.com/document/d/1hhhk-tC7PL-CA3skxnJJ8b40xb0zECMYAH9AUFad2gE/edit?usp=sharing">ingredients</a> ready!
																			</li>
																		</ul>
																	</div>
																</td>
															</tr>																															
																		<tr>
																			<td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																				<div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;"> 
																					If you have any questions or concerns, check out our FAQ or reach out to us at <a href="mailto:info@vandyhacks.org">info@vandyhacks.org</a>. 
																				</div>
																			</td>
																		</tr>
																		<tr>
																			<td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																				<div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;"> 
																					Cheers, 
																				</div>
																			</td>
																		</tr>
																		<tr>
																			<td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																				<div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#637381;"> 
																					The VandyHacks Team 
																				</div>
																			</td>
																		</tr>
																		<tr>
																			<td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																				<div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:10px;font-weight:400;line-height:20px;text-align:left;color:#637381;"> 
																					P.S. And of course, make sure to stay up-to-date by following us on <a href="https://www.instagram.com/vandyhacks/?hl=en">Instagram</a> and checking out our <a href="https://www.facebook.com/events/2701703253481744/">Facebook Event</a>
																				</div>
																			</td>
																		</tr>
																	</table>
																</div>
																<!--[if mso | IE]>
										</td>
									
								</tr>
							
													</table>
												<![endif]-->
															</td>
														</tr>
													</tbody>
												</table>
											</div>
											<!--[if mso | IE]>
									</td>
								</tr>
							</table>
							
											</td>
										</tr>
									
													</table>
												<![endif]-->
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<!--[if mso | IE]>
									</td>
								</tr>
							</table>
							<![endif]-->
						<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
							<tbody>
								<tr>
									<td>
										<!--[if mso | IE]>
							<table
								 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
							>
								<tr>
									<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
							<![endif]-->
										<div style="Margin:0px auto;max-width:600px;">
											<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
												<tbody>
													<tr>
														<td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
															<!--[if mso | IE]>
													<table role="presentation" border="0" cellpadding="0" cellspacing="0">
												
										<tr>
											<td
												 class="" width="600px"
											>
									
							<table
								 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
							>
								<tr>
									<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
							<![endif]-->
															<div style="Margin:0px auto;max-width:600px;">
																<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
																	<tbody>
																		<tr>
																			<td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;">
																				<!--[if mso | IE]>
													<table role="presentation" border="0" cellpadding="0" cellspacing="0">
												
								<tr>
							
										<td
											 class="" style="vertical-align:top;width:600px;"
										>
									<![endif]-->
																				<div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
																					<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
																						<tbody>
																							<tr>
																								<td style="vertical-align:top;padding:0;">
																									<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
																										<tr>
																											<td align="center" style="font-size:0px;padding:0;word-break:break-word;">
																												<!--[if mso | IE]>
							<table
								 align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
							>
								<tr>
							
											<td>
										<![endif]-->
																												<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
																													<tr>
																														<td style="padding:4px;">
																															<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#A1A0A0;border-radius:3px;width:30px;">
																																<tr>
																																	<td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://www.facebook.com/sharer/sharer.php?u=https://mjml.io/" target="_blank">
														<img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/facebook.png" style="border-radius:3px;" width="30">
													</a> </td>
																																</tr>
																															</table>
																														</td>
																													</tr>
																												</table>
																												<!--[if mso | IE]>
											</td>
										
											<td>
										<![endif]-->
																												<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
																													<tr>
																														<td style="padding:4px;">
																															<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#A1A0A0;border-radius:3px;width:30px;">
																																<tr>
																																	<td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://plus.google.com/share?url=https://mjml.io/" target="_blank">
														<img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/google-plus.png" style="border-radius:3px;" width="30">
													</a> </td>
																																</tr>
																															</table>
																														</td>
																													</tr>
																												</table>
																												<!--[if mso | IE]>
											</td>
										
											<td>
										<![endif]-->
																												<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="float:none;display:inline-table;">
																													<tr>
																														<td style="padding:4px;">
																															<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#A1A0A0;border-radius:3px;width:30px;">
																																<tr>
																																	<td style="font-size:0;height:30px;vertical-align:middle;width:30px;"> <a href="https://twitter.com/home?status=https://mjml.io/" target="_blank">
														<img height="30" src="https://www.mailjet.com/images/theme/v1/icons/ico-social/twitter.png" style="border-radius:3px;" width="30">
													</a> </td>
																																</tr>
																															</table>
																														</td>
																													</tr>
																												</table>
																												<!--[if mso | IE]>
											</td>
										
									</tr>
								</table>
							<![endif]-->
																											</td>
																										</tr>
																										<tr>
																											<td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																												<div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;"> 
																													You are receiving this application update because you applied at <a href="https://apply.vandyhacks.org" class="text-link" style="color: #5e6ebf;">apply.vandyhacks.org</a>. 
																													If you would like to opt-out of
																													any future emails pertaining to VandyHacks applications, please click <a href="https://apply.vandyhacks.org/api/unsubscribe?id=${
																														user._id
																													}" class="text-link" style="color: #5e6ebf;">here</a> </div>
																											</td>
																										</tr>
																										<tr>
																											<td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																												<div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:16px;text-align:center;color:#445566;"> &copy; 2020 VandyHacks, All Rights Reserved. </div>
																											</td>
																										</tr>
																									</table>
																								</td>
																							</tr>
																						</tbody>
																					</table>
																				</div>
																				<!--[if mso | IE]>
										</td>
									
								</tr>
							
													</table>
												<![endif]-->
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
															<!--[if mso | IE]>
									</td>
								</tr>
							</table>
							
											</td>
										</tr>
									
										<tr>
											<td
												 class="" width="600px"
											>
									
							<table
								 align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
							>
								<tr>
									<td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
							<![endif]-->
															<div style="Margin:0px auto;max-width:600px;">
																<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
																	<tbody>
																		<tr>
																			<td style="direction:ltr;font-size:0px;padding:20px 0;padding-top:0;text-align:center;vertical-align:top;">
																				<!--[if mso | IE]>
													<table role="presentation" border="0" cellpadding="0" cellspacing="0">
												
								<tr>
							
										<td
											 class="" style="width:600px;"
										>
									<![endif]-->
																				<div class="mj-column-per-100 outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;">
																					<!--[if mso | IE]>
								<table  role="presentation" border="0" cellpadding="0" cellspacing="0">
									<tr>
								
											<td
												 style="vertical-align:top;width:600px;"
											>
											<![endif]-->
																					<div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
																						<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
																							<tbody>
																								<tr>
																									<td style="vertical-align:top;padding-right:0;">
																										<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">
																											<tr>
																												<td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
																													<div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:bold;line-height:16px;text-align:center;color:#445566;"> <a class="footer-link" href="https://apply.vandyhacks.org/api/unsubscribe?id=${
																														user._id
																													}" style="color: #888888;">Unsubscribe</a> </div>
																												</td>
																											</tr>
																										</table>
																									</td>
																								</tr>
																							</tbody>
																						</table>
																					</div>
																					<!--[if mso | IE]>
											</td>
											
									</tr>
									</table>
								<![endif]-->
																				</div>
																				<!--[if mso | IE]>
										</td>
									
								</tr>
							
													</table>
												<![endif]-->
																			</td>
																		</tr>
																	</tbody>
																</table>
															</div>
															<!--[if mso | IE]>
									</td>
								</tr>
							</table>
							
											</td>
										</tr>
									
													</table>
												<![endif]-->
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<!--[if mso | IE]>
									</td>
								</tr>
							</table>
							<![endif]-->
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</body>
				
				</html>`,
			},
			Text: {
				Charset: 'UTF-8',
				Data: `Hi ${escape(user.preferredName || user.firstName)},
				Congratulations! You’re invited to be a part of VandyHacks VII: Retro Edition! We enjoyed reading your application and would love to see your ideas come to life during our virtual event on October 2nd-4th! 

				Head over to the application portal here and confirm your attendance by October 2nd, 12:00 PM CDT. Make sure you’ve also read and checked “agree” to our hackathon waiver under the hacker application.  
				
				Finally, please make sure to do the following in preparation for the event:
				Join our Discord here for communication before, during, and after the hackathon!
				Review the full hackathon schedule here! 
				*NOTE: We will be baking nutella hand pies at 5:00 PM CDT on Saturday, October 3rd, so get your ingredients ready!
				
				If you have any questions or concerns, check out our FAQ or reach out to us at info@vandyhacks.org.
				
				Cheers,
				The VandyHacks Team
				`,
			},
		},
		Subject: {
			Charset: 'UTF-8',
			Data: "You've Been Accepted!",
		},
	},
	Source: 'VandyHacks <noreply@vandyhacks.org>',
});
