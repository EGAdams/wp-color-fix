
select message_table.message
from wp_mcba_chat_conversations conversation_table,
	 wp_mcba_chat_messages message_table 
where conversation_table.mcba_chat_system_id='awm00101dev3@gmail.com' and 
	  message_table.conversation_id=conversation_table.conversation_id;
