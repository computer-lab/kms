// KMS (Kill My Slack)
// This function had the intended effect when pasted into the browser console on a "Manage members" page (`https://your-workspace.slack.com/admin'`) and executed on xx/xx/xxxx.

deactivateAllMembersButAdmins = (dryRun = true) => {
  const { bootData: { api_token }, adminMembers: { members }} = TS.redux.getState()
  const shouldDeactivate = m => !m.is_admin && !m.is_bot && !m.is_primary_owner && !m.is_owner
  const membersToDeactivate = members.filter(shouldDeactivate)
  console.log(`About to deactivate ${membersToDeactivate.length} members.`)
  const membersToSave = members.filter(m => !shouldDeactivate(m))
  console.log(`These members will not be deactivated: ${membersToSave.map(m => m.name).join(' ')}`)

  const TEST_UID = 'U0J6BDWMQ'

  const setMemberInactive = uid => fetch('/api/users.admin.setInactive', {
    "credentials":"include",
    headers:{
      'accept': '*/*',
      'accept-language':'en-US,en;q=0.9',
      'cache-control':'no-cache',
      "content-type":"multipart/form-data; boundary=----WebKitFormBoundaryNoTSkCwjrBCHDjr9",
      "pragma":"no-cache",
      "x-slack-version-ts":"1545436898"
    },
    "referrerPolicy":"no-referrer",
    "body":`------WebKitFormBoundaryNoTSkCwjrBCHDjr9\r\nContent-Disposition: form-data; name=\"user\"\r\n\r\n${uid}\r\n------WebKitFormBoundaryNoTSkCwjrBCHDjr9\r\nContent-Disposition: form-data; name=\"token\"\r\n\r\n${api_token}\r\n------WebKitFormBoundaryNoTSkCwjrBCHDjr9\r\nContent-Disposition: form-data; name=\"_x_mode\"\r\n\r\nonline\r\n------WebKitFormBoundaryNoTSkCwjrBCHDjr9--\r\n`,
    "method":"POST",
    "mode":"cors"
  });

  setMemberInactive(TEST_UID)
}

deactivateAllMembersButAdmins()

