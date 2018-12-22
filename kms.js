// kms (kill my slack)
//
// This function had the intended effect when pasted/executed in Chrome's browser
// console on Slacks's "Manage members" page
// (`https://computer-lab.slack.com/admin'`)  on 12/xx/2018.

deactivateAllMembersButAdmins = async (dryRun = true) => {
  const { bootData: { api_token }, adminMembers: { members }} = TS.redux.getState()
  const shouldDeactivate = m => !m.is_admin && !m.is_bot && !m.is_primary_owner && !m.is_owner
  const membersToDeactivate = members.filter(shouldDeactivate)
  console.log('membersToDeactivate:', membersToDeactivate);
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
  const timer = ms => Promise(resolve => setTimeout(resolve, ms))
  for (const m of membersToDeactivate) {
    if (dryRun) {
      pretendToSetMemberInactive(m)
    } else {
      setMemberInactive(m)
    }
    await timer(1000)
  }
}

await deactivateAllMembersButAdmins()

