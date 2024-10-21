

function VoucherBtn() {

  return (
      <div className="stipe-btn">
            <script async
              src="https://js.stripe.com/v3/buy-button.js">
            </script>
          <stripe-buy-button
            buy-button-id="buy_btn_1QAqLMF4F5VOfFUrTdeX7wtI"
            publishable-key="pk_live_51QAq8XF4F5VOfFUroW6Ta7IaXRKSptb4JBiDlHPglr20lJp8mWSfF6JWIsKoy2tVIqwJIiCYDkzSWQtvVGCssblj003qhHDmmD"
          >
          </stripe-buy-button>
      </div>
  )
}

export default VoucherBtn