import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });
  
    test('should display no tracks found when search does not match any tracks', async ({ page }) => {
      await page.fill('input[id=":r0:"]', 'Nonexistent Track');
  
      await expect(page.locator('#playlist-duration')).toBeVisible();
      await expect(page.locator('#playlist-duration')).toHaveText('No tracks on playlist');
  
      const trackCount = await page.locator('#tracklist .MuiBox-root div').count();
      expect(trackCount).toBe(0);
    });
  
    test('should display one track when search matches full track name', async ({ page }) => {
      await page.fill('input[id=":r0:"]', 'Summer Breeze');
  
      const trackName = await page.locator('#tracklist .MuiBox-root div p').nth(0).innerText();
      expect(trackName).toContain('Summer Breeze');
  
      const trackCount = await page.locator('#tracklist .MuiBox-root div p').count();
      expect(trackCount).toBe(2);
    });
  
    test('should display multiple tracks when search matches partial track name', async ({ page }) => {
      await page.fill('input[id=":r0:"]', 'er');
  
      const trackCount = await page.locator('#tracklist .MuiBox-root div').count();
      expect(trackCount).toBeGreaterThan(1);
    });
});

test.describe('Add Track Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
    });
  
    test('should add a single track using the "+" button', async ({ page }) => {
      await page.locator('div').filter({ hasText: /^Summer Breeze03:35\+$/ }).getByRole('button').click();
  
      const selectedTrackName = await page.locator('#tracklist .MuiBox-root div p').nth(0).innerText();
      const playlistTrackName = await page.locator('#playlist .MuiBox-root div p').nth(0).innerText();
      expect(playlistTrackName).toBe(selectedTrackName);
    });
  
    test('should calculate total duration of the playlist in seconds', async ({ page }) => {
      await page.locator('div').filter({ hasText: /^Summer Breeze03:35\+$/ }).getByRole('button').click();
      await page.locator('div').filter({ hasText: /^Autumn Leaves03:00\+$/ }).getByRole('button').click();
  
      const trackDuration1 = await page.locator('#tracklist .MuiBox-root div p').nth(1).innerText();
      const trackDuration2 = await page.locator('#tracklist .MuiBox-root div p').nth(3).innerText();
  
      const [minutes1, seconds1] = trackDuration1.split(':').map(Number);
      const [minutes2, seconds2] = trackDuration2.split(':').map(Number);
  
      const totalDurationSeconds = (minutes1 * 60 + seconds1) + (minutes2 * 60 + seconds2);
  
      const displayedDuration = Number(await page.locator('#playlist-duration').innerText());
      expect(displayedDuration).toBe(totalDurationSeconds);
    });
});