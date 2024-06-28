
  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    // Step 3: Exchange the authorization code for an access token
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = response.data.access_token;

    // Step 4: Use the access token to fetch user data
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json({
      user: userResponse.data,
      access_token: accessToken,
    });
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).send("Error authenticating with GitHub");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
