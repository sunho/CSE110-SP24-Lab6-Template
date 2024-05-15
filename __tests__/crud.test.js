describe('Basic user flow for CRUD Website', () => {
  beforeAll(async () => {
    await page.goto('https://sunho.io/CSE110-SP24-Lab6-Template/');
  });

  it('Add new note', async () => {
    console.log("Try adding new note by clicking add button.");
    await page.click('.add-note');
    const notes = await page.$$('.note');
    expect(notes.length).toBe(1);
  });

  it('Edit new note', async () => {
    console.log("Editing new note by typing.");
    await page.focus('.note');
    await page.keyboard.type('hello world');
    await page.focus('.add-note'); // Click outside of the note
    const note = (await page.$$('.note'))[0];
    const noteText = await (await note.getProperty('value')).jsonValue();
    expect(noteText).toBe('hello world');
  });

  it('Notes are saved locally', async () => {
    console.log("Page reloaded; make sure hello world note is still there");
    await page.reload();
    const note = (await page.$$('.note'))[0];
    const noteText = await (await note.getProperty('value')).jsonValue();
    expect(noteText).toBe('hello world');
  });

  it('Add two more notes', async () => {
    console.log("Add two more notes");
    await page.click('.add-note');
    await page.click('.add-note');
    const notes = await page.$$('.note');
    expect(notes.length).toBe(3);
  });

  it('Notes are saved locally', async () => {
    console.log("Page reloaded; make sure note count is 3");
    await page.reload();
    const notes = await page.$$('.note');
    expect(notes.length).toBe(3);
  });

  it('Delete notes', async () => {
    console.log("Delete all notes by double clicking");
    const notes = await page.$$('.note');
    for (let note of notes) {
      const noteEle = note.asElement();
      await noteEle.click({ clickCount: 2 });
    }
    const newNotes = await page.$$('.note');
    expect(newNotes.length).toBe(0);
  });

  it('Notes are saved locally', async () => {
    console.log("Page reloaded; there is no note left");
    await page.reload();
    const notes = await page.$$('.note');
    expect(notes.length).toBe(0);
  });

  //
  // test('Delete note by double clicking on note', async () => {
  //   await page.click('.add-note');
  //   const note = await page.$('.note');
  //   await note.dblclick();
  //   const notes = await page.$$('.note');
  //   expect(notes.length).toBe(0);
  // });
});
