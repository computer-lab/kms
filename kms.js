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

  const formData = new FormData()
  formData.append('user', TEST_UID)
  formData.append('token', api_token)
  formData.append('_x_mode', 'online')

  const setMemberInactive = uid => fetch('/api/users.admin.setInactive', {
    body: formData,
    method: 'POST',
  });

  setMemberInactive(TEST_UID)
}

deactivateAllMembersButAdmins()

