/*
kms (kill my slack)
This function had the intended effect when pasted/executed in Chrome's browser
console on Slack's "Manage members" page
(https://computer-lab.slack.com/admin)  on 12/22/2018.

I’ve found that deactivating all non admin users in a workspace (effectively “deactivating the slack”) 
during the holidays is a good way to give everyone a break, especially in noisy public slacks. 
Unfortunately, slack does not provide a “deactivate user” endpoint in their API (at least for free slacks), 
and manually deactivating all the users is a pain, so I had to go the “paste in browser console” route.
I might add some sort of reactivation function ... after the holidays.
*/

deactivateAllMembersButAdmins = async (dryRun = true) => {
  const { bootData: { api_token }, adminMembers: { members }} = TS.redux.getState()
  const shouldDeactivate = m => !m.is_admin && !m.is_bot && !m.is_primary_owner && !m.is_owner
  const membersToDeactivate = members.filter(shouldDeactivate)
  console.log(`About to deactivate ${membersToDeactivate.length} members.`)
  const membersToSave = members.filter(m => !shouldDeactivate(m))
  console.log(`These members will not be deactivated: ${membersToSave.map(m => m.name).join(' ')}`)
  const setMemberInactive = m => {
    const formData = new FormData()
    formData.append('user', m.id)
    formData.append('token', api_token)
    formData.append('_x_mode', 'online')
    return fetch('/api/users.admin.setInactive', {
      body: formData,
      method: 'POST',
    });
  }
  const pretendToSetMemberInactive = m => console.log(`Pretending to deactivate ${m.id}`)
  for (const m of membersToDeactivate) {
    if (dryRun) {
      pretendToSetMemberInactive(m)
    } else {
      await setMemberInactive(m)
    }
  }
}
