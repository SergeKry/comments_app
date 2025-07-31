from channels.generic.websocket import AsyncJsonWebsocketConsumer

class PostReplyConsumer(AsyncJsonWebsocketConsumer):
  async def connect(self):
    self.post_id = self.scope['url_route']['kwargs']['post_id']
    self.group_name = f'post_{self.post_id}'
    await self.channel_layer.group_add(self.group_name, self.channel_name)
    await self.accept()

  async def disconnect(self, close_code):
    await self.channel_layer.group_discard(self.group_name, self.channel_name)

  # handler when we send a message to the group
  async def new_reply(self, event):
    # event['reply'] is the serialized reply data
    await self.send_json(event['reply'])