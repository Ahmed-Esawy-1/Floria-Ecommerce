package com.ahmedesawy.floria.chatbot;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatBotService {

    private final ResourceLoader resourceLoader;
    private final VectorStore vectorStore;
    private final ChatClient chatClient;

    public String getBotResponse(String userQuery) {

        try {

            String template;
            try (InputStream is = resourceLoader.getResource("classpath:prompts/chatbot-rag-prompt.st")
                    .getInputStream()) {
                template = new String(is.readAllBytes(), StandardCharsets.UTF_8);
            }

            String context = fetchSemanticContext(userQuery);

            Map<String, Object> variables = new HashMap<>();
            variables.put("userQuery", userQuery);
            variables.put("context", context);

            PromptTemplate promptTemplate = PromptTemplate.builder()
                    .template(template)
                    .variables(variables)
                    .build();

            return chatClient.prompt(promptTemplate.create()).call().content();

        } catch (IOException e) {
            return "Bot Failed " + e.getMessage();
        }

    }

    // ---- HELPERS ----------------------------------------------------
    private String fetchSemanticContext(String useQuery) {

        List<Document> documents = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(useQuery)
                        .topK(5)
                        .similarityThreshold(.6)
                        .build());

        StringBuilder context = new StringBuilder();
        for (Document document : documents) {
            context.append(document.getFormattedContent()).append("\n");
        }

        return context.toString();
    }

}
