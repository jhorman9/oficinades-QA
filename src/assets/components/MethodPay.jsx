import React, { useEffect, useState } from 'react';

function MethodPay() {

  const [scriptAdded, setScriptAdded] = useState(false);

  useEffect(() => {

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true

    script.text = `
      $(document).ready(function(){
        $.ajax({
          type: "GET",
          url: "http://oficinaqas.idaan.gob.pa:5001/api/payment/GetPaymentsApiKey",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem('token')
          },
          success: function (apiKey) {
            if (apiKey) {
              $.ajax({
                type: "GET",
                url: "https://apicomponentv2-test.merchantprocess.net/UIComponent/CreditCard",
                data: {
                  "APIKey": apiKey,
                  "Culture": "es"
                },
                success: function (jsonResponse) {
                  $("#creditcard-container").html(jsonResponse);
                  $("#creditcard-container").slideDown(500);
                }
              });
            }
          },
        });
      });

        function SaveCreditCard_FailureCallback(response){				
        }

        function SaveCreditCard_SuccessCallback(response){	
            sendData(response);
            $('#card-ui-component-btn-cancel').text('Pagar');
        }
        function SaveCreditCard_CancelCallback(){
            $("#creditcard-container").slideUp(500);
        }

        function sendData(response){
          var cardToken;
          var accountNumber;
          var cardholderName;
          var associatedCard;
          var idTokenization;
          cardToken = response.TokenDetails.AccountToken;
          accountNumber = response.TokenDetails.AccountNumber;
          cardholderName = response.TokenDetails.CardHolderName;
          associatedCard = response.TokenDetails.CardNumber;
          idTokenization = response.TokenDetails.Id;

          $.ajax({
            type: "POST",
            url: "http://oficinaqas.idaan.gob.pa:5001/api/card/AddCardOption",
            data: JSON.stringify({
              CardOption: {
                CardName: cardholderName,
                CardNumber: associatedCard,
                CardToken: cardToken,
                AccountNumber: accountNumber,
                TokenizationId: idTokenization.toString(),
              },
            }),
            contentType: "application/json",
            dataType: "json",
            headers: {
              "Authorization": "Bearer " + localStorage.getItem('token')
            },
            success: function (responseData) {
            },
          });

        }
    `;
    document.body.appendChild(script)
      setScriptAdded(true);
      
      return () => {
        document.body.removeChild(script);
        setScriptAdded(false);
      };
  }, []);

  const containerStyle = {
    margin: '0 auto',
    paddingTop: '10px',
  };

  return (
    <div style={containerStyle}>
      <div id="creditcard-container"></div>
    </div>
  );
}

export default MethodPay;
