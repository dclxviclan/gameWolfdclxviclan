(async () => {
    // create and show the notification
    const showNotification = () => {
        // create a new notification
        const notification = new Notification('JavaScript Notification API', {
            body: 'This is a JavaScript Notification API demo',
            icon: 'image1.png'
        });

        // close the notification after 10 seconds
        setTimeout(() => {
            notification.close();
        }, 10 * 1000);

        // navigate to a URL when clicked
        notification.addEventListener('click', () => {

            window.open('https://dclxviclan.itch.io/happy-new-year');
        });
    }

    let notification
    let interval
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        const leaveDate = new Date()
        interval = setInterval(() => {
          notification = new Notification("Come back to dclxviclan", {
            body: `You have been gone for ${Math.round((new Date() - leaveDate) / 1000)} seconds`,
            tag: "Come Back",
            icon: 'image1.png',
          })
	  notification.addEventListener('click', () => {

            window.open('https://dclxviclan.itch.io/happy-new-year');
          })
        }, 100)
      } else {
        if (interval) clearInterval(interval)
        if (notification) notification.close()
      }
    })
    // show an error message
    const showError = () => {
        const error = document.querySelector('.error');
        error.style.display = 'block';
        error.textContent = 'You blocked the notifications';
    }

    // check notification permission
    let granted = false;

    if (Notification.permission === 'granted') {
        granted = true;
    } else if (Notification.permission !== 'denied') {
        let permission = await Notification.requestPermission();
        granted = permission === 'granted' ? true : false;
    }

    // show notification or error
    granted ? showNotification() : showError();

})();
