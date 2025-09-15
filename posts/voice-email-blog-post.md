# Dictation doesn't help you write emails, neither do LLMs buuuuuuuuuuut

![PPAP](./dbz.png)


## The Workflow

Off-the-dome Yapping -> Dictation Software -> LLM -> Email Client

![Workflow Diagram](./workflow-diagram.svg)


It's legitimately twice as fast as typing. Maybe sounds like hype but I timed it.

![Voice Demo](./typing-demo.gif)

If you send 40 emails a week and each one takes 5 minutes to type, (which statistically you do [1] and they do [2]), that's 200 minutes. Cut that in half and you just saved a cool 1 hour 40 every week. And it's a lot more fun.

## More Detail

1. Enable dictation on your computer (ask your LLM how) then just 
2. Talk through what you want your email to say. Not carefully dictating - just explaining, stream of consciousness, keep in the ums and ahh's and backtracking, then at the end say "dash dash dash dash, make this into a really nice email"
3. take that transcript, paste it into Claude or ChatGPT (or on a mac you can dictate directly into the LLM chat interface), and it gives you something you can *nearly* send. 
5. Proof read
4. Copy-paste that into your email client, tweak it a bit
5. Send

For a 100 word email the whole process takes about 3 minutes, or half the time of typing it out character by character. That's for me at least, and my WPM is a reasonable 80-90.

Also, again it's a lot more fun to speak your ideas out loud. It feels like you're an aristocrat with a scribe sitting there taking notes.

## Research?

Research.

![Typing vs Dictation Study](./typing-vs-dictation.png)

Stanford did a study in 2016 [3] where they found dictation is 3x faster than typing on mobile devices. But that was traditional dictation where you speak every word exactly as it should appear.

This is different - you're not dictating the final text, you're dictating the rough ideas. The LLM handles turning your rambling into a clean final text. It's probably much faster than what they measured, though that's yet to be proven.

There's also some research [4] to say that typing is around as cognitively demanding as dictation. But again, the "brain dump emails" are probably a lot **less** cognitively demanding than dictation since you can make as many mistakes as you like, the LLM's got your back.

## Why Everyone Isn't Doing This Yet

I actually don't know.

What I DO know though is that I spent a whole weekend overengineering this concept. I tried several different setups and found the easiest-to-setup MCP server for Gmail integration so I could tell claude "send the email" and it would do that too. Total waste tough.

Copy-paste is fine. Actually, it's better since - you'll want to tweak the output anyway.

What matters is this: **You'll write emails 2x faster and actually enjoy it.**

## Just Try It Once

Next email you need to write, try this instead of typing. Takes 3 minutes to set up and could save you half your email writing time.

---

## References

[1] Karat, C.M., Halverson, C., Horn, D., Karat, J. (1999). "Patterns of entry and correction in large vocabulary continuous speech recognition systems". Proceedings of the SIGCHI conference on Human Factors in Computing Systems (CHI '99). New York, NY, US: ACM. pp. 568–575. doi:10.1145/302979.303160

[2] Slack. "How to save employees time". Slack Blog. https://slack.com/intl/en-au/blog/productivity/save-employees-time

[3] Ruan, S., Wobbrock, J.O., Liou, K., Ng, A., Landay, J. (2016). "Speech Is 3x Faster than Typing for English and Mandarin Text Entry on Mobile Devices". arXiv preprint. doi:10.1145/302979.303160

[4] Medimorec, S., Risko, E.F. (2023). "Comparing the cognitive demands of writing by hand versus typing". Frontiers in Psychology, 14. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1108898/full