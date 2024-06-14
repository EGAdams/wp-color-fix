var account_balance = ${account_balance}; 
var credit_card_balance = ${credit_card_balance}; 
account_balance = account_balance.replace( "$", "" ).replace( ",", "" );
credit_card_balance = credit_card_balance.replace( "$", "" ).replace( ",", "" );

alert( account_balance - credit_card_balance );