package biz.oneilindustries.filesharer;

import io.micrometer.core.instrument.Clock;
import io.micrometer.core.ipc.http.OkHttpSender;
import io.micrometer.influx.InfluxConfig;
import io.micrometer.influx.InfluxMeterRegistry;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Properties;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.CookieLocaleResolver;

@Configuration
@EnableAspectJAutoProxy
@EnableSpringDataWebSupport
@EnableAsync
@SpringBootApplication(exclude = HibernateJpaAutoConfiguration.class)
public class AppConfig {

	@Value("${management.metrics.export.influx.org}")
	private String org;

	@Value("${management.metrics.export.influx.bucket}")
	private String bucket;

	@Value("${management.metrics.export.influx.token}")
	private String token;

	@Value("${sendGrid.apiKey}")
	private String sendGridAPI;
	public static final ArrayList<String> ADMIN_ROLES;

	static {
		ADMIN_ROLES = new ArrayList<>();
		ADMIN_ROLES.add("ROLE_ADMIN");
	}

	@Bean
	public JavaMailSender getJavaMailSender() {
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost("smtp.sendgrid.net");
		mailSender.setPort(587);

		mailSender.setUsername("apikey");
		mailSender.setPassword(sendGridAPI);

		Properties props = mailSender.getJavaMailProperties();
		props.put("mail.transport.protocol", "smtp");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.starttls.enable", "true");
		props.put("mail.debug", "true");

		return mailSender;
	}

	@Bean(name = "customMessageSource")
	public MessageSource messageSource() {
		ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
		messageSource.setBasename("classpath:messages");
		messageSource.setDefaultEncoding("UTF-8");
		return messageSource;
	}

	@Bean
	public LocaleResolver localeResolver() {
		final CookieLocaleResolver cookieLocaleResolver = new CookieLocaleResolver();
		cookieLocaleResolver.setDefaultLocale(Locale.ENGLISH);
		return cookieLocaleResolver;
	}

	@Bean
	public InfluxMeterRegistry influxMeterRegistry(InfluxConfig influxConfig, Clock clock) {
		OkHttpClient.Builder httpClient = new OkHttpClient.Builder();

		httpClient.addInterceptor(chain -> {
			Request original = chain.request();
			// skip others than write
			if (!original.url().pathSegments().contains("write")) {
				return  chain.proceed(original);
			}
			HttpUrl url = original.url()
				.newBuilder()
				.removePathSegment(0)
				.addEncodedPathSegments("api/v2/write")
				.removeAllQueryParameters("db")
				.removeAllQueryParameters("consistency")
				.addQueryParameter("org", org)
				.addQueryParameter("bucket", bucket)
				.build();

			Request request = original.newBuilder()
				.url(url)
				.header("Authorization", "Token " + token)
				.build();

			return chain.proceed(request);
		});

		return InfluxMeterRegistry.builder(influxConfig)
			.clock(clock)
			.httpClient(new OkHttpSender(httpClient.build()))
			.build();
	}

	public static void main(String[] args) {
		SpringApplication.run(AppConfig.class, args);
	}

}









