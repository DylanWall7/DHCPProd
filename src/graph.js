import { graphConfig, DHCPStats, PostReservation } from "./authConfig";

/**
 * Attaches a given access token to a Microsoft Graph API call. Returns information about the user
 */
export async function callMsGraph(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function Reservation(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "POST",
    headers: headers,
  };

  return fetch(PostReservation.PostReservationEndpoint, options)
    .then((response) => response.json()(console.log(response)))

    .catch((error) => console.log(error));
}

export async function callDHCP(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(DHCPStats.DHCPStatsEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
