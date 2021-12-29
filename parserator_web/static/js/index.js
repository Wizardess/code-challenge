$('form').on('submit', function (event) {
  /** Connect the HTML form to the API and render results in the
  #address-results div. */

  // Prevent the page from reloading
  event.preventDefault()

  // Load form data into userInput as a JSON object
  var userInput = $('form').serializeArray()

  // GET request to parserator API
  $.ajax({
    method: 'GET',
    url: '/api/parse/',
    data: userInput,
    beforeSend: function () {
      /**
       * Catch obviously bad inputs clientside.
       */

      // Catch empty inputs or inputs consisting of only spaces
      if ($('#address:text').val().trim() == '') {
        
        // Add extra error info
        $('#error-info').html("It looks like nothing was typed in the address form. \
                              Try typing an address, such as '123 Main St. Suite 100\
                              , Chicago, Il', into the form and press the Parse! button.")
        
        // Make sure error message is visible
        $('#error-message').show()

        // Make sure address component table is hidden
        $('#address-results').hide()
        return false
      }
    },
    success: function (response) {
      /**
       * Display address components, their respective tags, and
       * address type for street addresses or ambiguous addresses.*/

      // Extract data from GET response object
      // pytest Does Not Like this syntax, but from what I can tell it's okay.
      var {address_components,address_type} = response

      // Make sure the error message is hidden
      $('#error-message').hide()

      // Clear data from previous queries from the component table
      $('tbody').html('')

      /* Fill the address component table: For each address component,
      append a row to the table with the component and its tag. */
      $.each(address_components, function (tag, component) {
        $('tbody').append('<tr><td>'+component+'</td><td>'+tag+'</td></tr>')
      })

      // Make sure the address component table is visible
      $('#address-results').show()

      // Display address type in parse-type
      $('#parse-type').html(address_type)
    },
    statusCode: {
      400: function (response) {
      /** Catch exceptions stemming from usaddress parseError */

        // Extract error message from GET response object
        var error_message = response.responseJSON.error_message

        // Display the error message from the API
        $('#error-info').html(error_message)

        // Make sure the error message is visible
        $('#error-message').show()

        // Make sure the address component table is hidden
        $('#address-results').hide()
      }
    }
  })
})