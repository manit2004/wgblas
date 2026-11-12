CC = nvcc
BIN = bin
HDRS = ../../utils/helpers.h ../../utils/harness.h ../../utils/params.h

all: $(BIN)/sscal

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sscal: sscal.c $(HDRS) | $(BIN)
	$(CC) sscal.c -o $(BIN)/sscal -lcublas

clean:
	rm -rf $(BIN)
